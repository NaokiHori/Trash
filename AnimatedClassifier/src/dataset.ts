import { X_LIMITS, Y_LIMITS } from "./param";
import { Vector, innerProduct } from "./vector";

export interface DataPoint {
  vector: Vector;
  category: number;
}

function pickUpDataPoint(normalVector: Vector): {
  vector: Vector;
  category: number;
} {
  const threshold = 0.1;
  for (;;) {
    const vector: Vector = [
      1,
      (X_LIMITS[1] - X_LIMITS[0]) * Math.random() + X_LIMITS[0],
      (Y_LIMITS[1] - Y_LIMITS[0]) * Math.random() + Y_LIMITS[0],
    ];
    const numerator = innerProduct(normalVector, vector);
    const denominator = Math.sqrt(
      Math.pow(normalVector[1], 2) + Math.pow(normalVector[2], 2),
    );
    const signedDistance = numerator / denominator;
    if (threshold < Math.abs(signedDistance)) {
      return { vector, category: 0 < signedDistance ? 1 : -1 };
    }
  }
}

function computeStatisticalMoments(dataPoints: Array<DataPoint>): {
  mean: Vector;
  std: Vector;
} {
  const ndims = 3;
  const mean: Vector = [0, 0, 0];
  const std: Vector = [0, 0, 0];
  for (const dataPoint of dataPoints) {
    const vector = dataPoint.vector;
    for (let dim = 0; dim < ndims; dim++) {
      mean[dim] += vector[dim];
      std[dim] += Math.pow(vector[dim], 2);
    }
  }
  const nitems = dataPoints.length;
  for (let dim = 0; dim < ndims; dim++) {
    mean[dim] = mean[dim] / nitems;
    std[dim] = Math.sqrt(std[dim] / nitems);
  }
  return { mean, std };
}

function standardize(
  statisticalMoments: { mean: Vector; std: Vector },
  vector: Vector,
): Vector {
  return [
    1,
    (vector[1] - statisticalMoments.mean[1]) / statisticalMoments.std[1],
    (vector[2] - statisticalMoments.mean[2]) / statisticalMoments.std[2],
  ];
}

function computeGradients(
  nitems: number,
  h: Readonly<Float64Array>,
  multipliers: Readonly<Float64Array>,
  gradients: Float64Array,
) {
  for (let i = 0; i < nitems; i++) {
    gradients[i] = 1;
    for (let j = 0; j < nitems; j++) {
      gradients[i] -= h[i * nitems + j] * multipliers[j];
    }
  }
}

function computeNewLearningRate(
  nitems: number,
  multipliers: Readonly<Float64Array>,
  newMultipliers: Readonly<Float64Array>,
  gradients: Readonly<Float64Array>,
  newGradients: Readonly<Float64Array>,
): { newLearningRate: number; isCompleted: boolean } {
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < nitems; i++) {
    const dMultipliers: number = newMultipliers[i] - multipliers[i];
    const dGradients: number = newGradients[i] - gradients[i];
    numerator += dMultipliers * dGradients;
    denominator += dGradients * dGradients;
  }
  if (denominator < Number.EPSILON) {
    return { newLearningRate: 0, isCompleted: true };
  } else {
    return {
      newLearningRate: Math.abs(numerator) / denominator,
      isCompleted: false,
    };
  }
}

function isSupportVector(multipliers: number): boolean {
  return Number.EPSILON < multipliers;
}

export class Dataset {
  private _nitems: number;
  private _dataPoints: Array<DataPoint>;
  private _epoch: number;
  private _learningRate: number;
  private _h: Float64Array;
  private _multipliers: Float64Array;
  private _gradients: Float64Array;
  private _newMultipliers: Float64Array;
  private _newGradients: Float64Array;
  private _weights: Vector;
  private _statisticalMoments: { mean: Vector; std: Vector };
  private _isCompleted: boolean;

  public constructor(nitems: number) {
    const normalVector: Vector = [
      0.25 * (Math.random() - 0.5),
      Math.random() - 0.5,
      Math.random() - 0.5,
    ];
    const dataPoints = new Array<DataPoint>();
    for (let n = 0; n < nitems; n++) {
      dataPoints.push(pickUpDataPoint(normalVector));
    }
    const statisticalMoments = computeStatisticalMoments(dataPoints);
    const h = new Float64Array(nitems * nitems);
    for (let i = 0; i < nitems; i++) {
      const pi = dataPoints[i];
      const yi = pi.category;
      const vi = pi.vector;
      const viScaled: Vector = standardize(statisticalMoments, vi);
      for (let j = 0; j < nitems; j++) {
        const pj = dataPoints[j];
        const yj = pj.category;
        const vj = pj.vector;
        const vjScaled: Vector = standardize(statisticalMoments, vj);
        h[i * nitems + j] = yi * yj * innerProduct(viScaled, vjScaled);
      }
    }
    this._nitems = nitems;
    this._dataPoints = dataPoints;
    this._epoch = 0;
    this._learningRate = 1;
    this._h = h;
    this._multipliers = new Float64Array(nitems);
    this._gradients = new Float64Array(nitems);
    this._weights = [0, 0, 0];
    this._newMultipliers = new Float64Array(nitems);
    this._newGradients = new Float64Array(nitems);
    this._statisticalMoments = statisticalMoments;
    this._isCompleted = false;
  }

  public train() {
    if (this._isCompleted) {
      return;
    }
    const nitems: number = this._nitems;
    const dataPoints: Array<DataPoint> = this._dataPoints;
    const h: Float64Array = this._h;
    const multipliers: Float64Array = this._multipliers;
    const gradients: Float64Array = this._gradients;
    const newMultipliers: Float64Array = this._newMultipliers;
    const newGradients: Float64Array = this._newGradients;
    const weights: Vector = this._weights;
    const statisticalMoments = this._statisticalMoments;
    computeGradients(nitems, h, multipliers, gradients);
    for (;;) {
      for (let i = 0; i < nitems; i++) {
        newMultipliers[i] = Math.max(
          0,
          multipliers[i] + this._learningRate * gradients[i],
        );
      }
      computeGradients(nitems, h, newMultipliers, newGradients);
      const { newLearningRate, isCompleted } = computeNewLearningRate(
        nitems,
        multipliers,
        newMultipliers,
        gradients,
        newGradients,
      );
      if (isCompleted) {
        this._isCompleted = true;
        break;
      } else if (this._learningRate <= newLearningRate) {
        for (let i = 0; i < nitems; i++) {
          multipliers[i] = newMultipliers[i];
        }
        break;
      } else {
        this._learningRate = newLearningRate;
      }
    }
    const scaledWeights: Vector = [0, 0, 0];
    for (let i = 0; i < nitems; i++) {
      const dataPoint: DataPoint = dataPoints[i];
      const vector: Vector = dataPoint.vector;
      const scaledVector: Vector = standardize(statisticalMoments, vector);
      const category: number = dataPoint.category;
      scaledWeights[1] += multipliers[i] * category * scaledVector[1];
      scaledWeights[2] += multipliers[i] * category * scaledVector[2];
    }
    let nSupportVectors = 0;
    for (let i = 0; i < nitems; i++) {
      if (!isSupportVector(multipliers[i])) {
        continue;
      }
      const dataPoint: DataPoint = dataPoints[i];
      const vector: Vector = dataPoint.vector;
      const scaledVector: Vector = standardize(statisticalMoments, vector);
      const category: number = dataPoint.category;
      scaledWeights[0] += category;
      scaledWeights[0] -= scaledWeights[1] * scaledVector[1];
      scaledWeights[0] -= scaledWeights[2] * scaledVector[2];
      nSupportVectors += 1;
    }
    scaledWeights[0] /= nSupportVectors;
    // rescale to recover original Cartesian coordinate
    // on the scaled coordinate (XY), the decision boundary is given by
    //   w0 + w1 * X + w2 * Y = 0
    // by facilitating
    //   X = (x - meanX) / stdX
    //   Y = (y - meanY) / stdY
    // the same linear function on the original coordinate is
    //   w0 + w1 * (x - meanX) / stdX + w2 * (y - meanY) / stdY = 0
    // or equivalently
    //   (w0 - w1 * meanX / stdX - w2 * meanY / stdY)
    //   +
    //   (w1 / stdX) * x
    //   +
    //   (w2 / stdY) * y
    //   =
    //   0
    weights[0] =
      scaledWeights[0] -
      (scaledWeights[1] * statisticalMoments.mean[1]) /
        statisticalMoments.std[1] -
      (scaledWeights[2] * statisticalMoments.mean[2]) /
        statisticalMoments.std[2];
    weights[1] = scaledWeights[1] / statisticalMoments.std[1];
    weights[2] = scaledWeights[2] / statisticalMoments.std[2];
    this._epoch += 1;
  }

  public getDataPoint(i: number): Readonly<DataPoint> {
    return this._dataPoints[i];
  }

  public isSupportVector(i: number): boolean {
    return isSupportVector(this._multipliers[i]);
  }

  public get weights(): Readonly<Vector> {
    return this._weights;
  }

  public get epoch(): number {
    return this._epoch;
  }

  public get isCompleted(): boolean {
    return this._isCompleted;
  }
}
