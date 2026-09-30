import { X_LIMITS, Y_LIMITS } from "./param";

export type Vector = [number, number];
export type Category = -1 | 1;

const MULTIPLIER_TOLERANCE = 1e-8;
const C = 1e3;

export interface Sample {
  vector: Vector;
  category: Category;
}

function isSupportVector(multiplier: number): boolean {
  return MULTIPLIER_TOLERANCE < multiplier;
}

export class Dataset {
  private nitems: number;
  private samples: Array<Sample>;
  private step: number;
  private multipliers: Float64Array;
  private isCompleted: boolean;
  private computeKernel: (vector0: Vector, vector1: Vector) => number;
  private supportVectors: Array<[Readonly<Sample>, number]>;

  public constructor(
    nitems: number,
    categorizer: (position: Vector) => Category,
    computeKernel: (vector0: Vector, vector1: Vector) => number,
  ) {
    const samples = new Array<Sample>();
    for (let n = 0; n < nitems; n += 1) {
      const vector: Vector = [
        (X_LIMITS[1] - X_LIMITS[0]) * Math.random() + X_LIMITS[0],
        (Y_LIMITS[1] - Y_LIMITS[0]) * Math.random() + Y_LIMITS[0],
      ];
      samples.push({
        vector,
        category: categorizer(vector),
      });
    }
    this.nitems = nitems;
    this.samples = samples;
    this.step = 0;
    this.multipliers = new Float64Array(nitems + 1);
    this.isCompleted = false;
    this.computeKernel = computeKernel;
    this.supportVectors = [];
  }

  public train(): number {
    if (this.isCompleted) {
      return 0;
    }
    const tolerance = 1e-8;
    const [residual, [index0, index1]] = this.chooseIndices();
    if (residual < tolerance) {
      this.isCompleted = true;
    }
    this.updateMultipliers(index0, index1);
    this.step += 1;
    return residual;
  }

  public getSample(i: number): Readonly<Sample> {
    return this.samples[i];
  }

  public isSupportVector(i: number): boolean {
    return isSupportVector(this.multipliers[i]);
  }

  public getStep(): number {
    return this.step;
  }

  public getIsCompleted(): boolean {
    return this.isCompleted;
  }

  public updateSupportVectors(): void {
    const nitems = this.nitems;
    const samples = this.samples;
    const multipliers = this.multipliers;
    this.supportVectors = new Array<[Readonly<Sample>, number]>();
    for (let i = 0; i < nitems; i += 1) {
      const multiplier = multipliers[i];
      if (isSupportVector(multiplier)) {
        this.supportVectors.push([samples[i], multiplier]);
      }
    }
  }

  public categorize(at: Vector): number {
    this.updateSupportVectors();
    const nitems = this.nitems;
    let value = this.multipliers[nitems];
    for (const [sample, multiplier] of this.supportVectors) {
      value += multiplier * sample.category * this.computeKernel(at, sample.vector);
    }
    return value;
  }

  private chooseIndices(): [number, [number, number]] {
    const nitems = this.nitems;
    const samples: Array<Sample> = this.samples;
    const multipliers: Float64Array = this.multipliers;
    let lowerExists = false;
    let upperExists = false;
    let lowerIndex = 0;
    let upperIndex = 0;
    let lowerValue = -Infinity;
    let upperValue = Infinity;
    for (let i = 0; i < nitems; i += 1) {
      const sample = samples[i];
      const multiplier = multipliers[i];
      let value = sample.category;
      for (let j = 0; j < nitems; j += 1) {
        value -=
          multipliers[j] *
          samples[j].category *
          this.computeKernel(sample.vector, samples[j].vector);
      }
      const isLower =
        (sample.category === 1 && multiplier < C - MULTIPLIER_TOLERANCE) ||
        (sample.category === -1 && MULTIPLIER_TOLERANCE < multiplier);
      const isUpper =
        (sample.category === 1 && MULTIPLIER_TOLERANCE < multiplier) ||
        (sample.category === -1 && multiplier < C - MULTIPLIER_TOLERANCE);
      if (isLower) {
        lowerExists = true;
        if (lowerValue < value) {
          lowerValue = value;
          lowerIndex = i;
        }
      }
      if (isUpper) {
        upperExists = true;
        if (value < upperValue) {
          upperValue = value;
          upperIndex = i;
        }
      }
    }
    if (!(lowerExists && upperExists)) {
      return [0, [-1, -1]];
    }
    multipliers[nitems] = 0.5 * lowerValue + 0.5 * upperValue;
    return [lowerValue - upperValue, [lowerIndex, upperIndex]];
  }

  private updateMultipliers(index0: number, index1: number): void {
    const samples: Array<Sample> = this.samples;
    const multipliers: Float64Array = this.multipliers;
    const sample0 = samples[index0];
    const sample1 = samples[index1];
    const category0 = sample0.category;
    const category1 = sample1.category;
    const total = category0 * multipliers[index0] + category1 * multipliers[index1];
    const k00 = this.computeKernel(sample0.vector, sample0.vector);
    const k01 = this.computeKernel(sample0.vector, sample1.vector);
    const k11 = this.computeKernel(sample1.vector, sample1.vector);
    const denominator = 2 * k01 - k00 - k11;
    if (Math.abs(denominator) < Number.EPSILON) {
      return;
    }
    const [sum0, sum1] = this.computeSum(index0, index1);
    let multiplier0 =
      (category0 * category1 - 1 + total * category0 * (k01 - k11) + category0 * (sum0 - sum1)) /
      denominator;
    const lower =
      category0 === category1 ? Math.max(0, total * category0 - C) : Math.max(0, total * category0);
    const upper =
      category0 === category1 ? Math.min(C, total * category0) : Math.min(C, C + total * category0);
    multiplier0 = Math.max(multiplier0, lower);
    multiplier0 = Math.min(multiplier0, upper);
    multipliers[index0] = multiplier0;
    multipliers[index1] = category1 * (total - category0 * multiplier0);
  }

  private computeSum(index0: number, index1: number): [number, number] {
    const nitems = this.nitems;
    const samples: Array<Sample> = this.samples;
    const multipliers: Float64Array = this.multipliers;
    const sample0 = samples[index0];
    const sample1 = samples[index1];
    let sum0 = 0;
    let sum1 = 0;
    for (let i = 0; i < nitems; i += 1) {
      if (index0 === i || index1 === i) {
        continue;
      }
      const sample = samples[i];
      const multiplier = multipliers[i];
      sum0 += multiplier * sample.category * this.computeKernel(sample0.vector, sample.vector);
      sum1 += multiplier * sample.category * this.computeKernel(sample1.vector, sample.vector);
    }
    return [sum0, sum1];
  }
}
