import { GRAVITATIONAL_ACCELERATION } from "./parameter";
import { Cart, Pendulum } from "./simulator";
import { PidParameters } from "./controller/pidParameters";

export { PidParameters } from "./controller/pidParameters";

interface FromPolesReturn {
  cart: PidParameters;
  pendulum: PidParameters;
}

function getIdentityMatrix(nItems: number): Float64Array {
  const identity = new Float64Array(nItems * nItems);
  for (let i = 0; i < nItems; i += 1) {
    identity[i * nItems + i] = 1;
  }
  return identity;
}

function computeScalarMatrixMultiplication(
  nItems: number,
  k: number,
  a: Float64Array,
): Float64Array {
  const b = new Float64Array(nItems * nItems);
  for (let i = 0; i < nItems; i += 1) {
    for (let j = 0; j < nItems; j += 1) {
      b[i * nItems + j] = k * a[i * nItems + j];
    }
  }
  return b;
}

function computeMatrixMatrixMultiplication(
  nItems: number,
  a: Float64Array,
  b: Float64Array,
): Float64Array {
  const c = new Float64Array(nItems * nItems);
  for (let i = 0; i < nItems; i += 1) {
    for (let j = 0; j < nItems; j += 1) {
      for (let k = 0; k < nItems; k += 1) {
        c[i * nItems + j] += a[i * nItems + k] * b[k * nItems + j];
      }
    }
  }
  return c;
}

function computeMatrixVectorMultiplication(
  nItems: number,
  a: Float64Array,
  b: Float64Array,
): Float64Array {
  const c = new Float64Array(nItems);
  for (let i = 0; i < nItems; i += 1) {
    for (let j = 0; j < nItems; j += 1) {
      c[i] += a[i * nItems + j] * b[j];
    }
  }
  return c;
}

function computeMatrixAddition(
  nItems: number,
  a: Float64Array,
  b: Float64Array,
): Float64Array<ArrayBuffer> {
  const c = new Float64Array(nItems * nItems);
  for (let i = 0; i < nItems; i += 1) {
    for (let j = 0; j < nItems; j += 1) {
      c[i * nItems + j] = a[i * nItems + j] + b[i * nItems + j];
    }
  }
  return c;
}

function computeInverseMatrix(nItems: number, a: Float64Array): Float64Array {
  const b = getIdentityMatrix(nItems);
  for (let i = 0; i < nItems; i += 1) {
    // 1. Partial Pivoting: Find the pivot row with the maximum absolute value in column i
    let maxRow = i;
    let maxVal = Math.abs(a[i * nItems + i]);
    for (let k = i + 1; k < nItems; k += 1) {
      const absVal = Math.abs(a[k * nItems + i]);
      if (absVal > maxVal) {
        maxVal = absVal;
        maxRow = k;
      }
    }
    if (maxVal === 0) {
      throw new Error("Matrix is singular and cannot be inverted.");
    }
    // 2. Swap rows in both 'a' and 'b' if needed
    if (maxRow !== i) {
      for (let j = 0; j < nItems; j += 1) {
        const idx1 = i * nItems + j;
        const idx2 = maxRow * nItems + j;
        // Swap elements in matrix a
        const tempA = a[idx1];
        a[idx1] = a[idx2];
        a[idx2] = tempA;
        // Swap elements in matrix b
        const tempB = b[idx1];
        b[idx1] = b[idx2];
        b[idx2] = tempB;
      }
    }
    // 3. Normalize the pivot row so that the pivot element a[i, i] becomes 1
    const pivot = a[i * nItems + i];
    for (let j = 0; j < nItems; j += 1) {
      a[i * nItems + j] /= pivot;
      b[i * nItems + j] /= pivot;
    }
    // 4. Eliminate elements above and below the pivot
    for (let r = 0; r < nItems; r += 1) {
      if (r !== i) {
        const factor = a[r * nItems + i];
        for (let c = 0; c < nItems; c += 1) {
          a[r * nItems + c] -= factor * a[i * nItems + c];
          b[r * nItems + c] -= factor * b[i * nItems + c];
        }
      }
    }
  }
  return b;
}

export function fromPoles(cart: Cart, pendulum: Pendulum): FromPolesReturn {
  const nItems = 4;
  const a = new Float64Array(nItems * nItems);
  a[1] = 1;
  a[6] = (-GRAVITATIONAL_ACCELERATION * pendulum.getMass()) / cart.getMass();
  a[11] = 1;
  a[14] =
    (-GRAVITATIONAL_ACCELERATION / pendulum.getLength()) *
    (1 + pendulum.getMass() / cart.getMass());
  const b = new Float64Array([0, 1 / cart.getMass(), 0, 1 / cart.getMass() / pendulum.getLength()]);
  const etas = [0.7, 0.9];
  const omegas = [20, 6];
  const polynomial = [
    Math.pow(omegas[0], 2) * Math.pow(omegas[1], 2),
    2 * omegas[0] * omegas[1] * (etas[0] * omegas[1] + etas[1] * omegas[0]),
    omegas[0] * (omegas[0] + 2 * etas[0] * etas[1] * omegas[1]) +
      omegas[1] * (2 * etas[0] * etas[1] * omegas[0] + omegas[1]),
    2 * (etas[0] * omegas[0] + etas[1] * omegas[1]),
    1,
  ];
  const a2 = computeMatrixMatrixMultiplication(nItems, a, a);
  const a3 = computeMatrixMatrixMultiplication(nItems, a, a2);
  const a4 = computeMatrixMatrixMultiplication(nItems, a, a3);
  const aPowers = [getIdentityMatrix(nItems), a, a2, a3, a4];
  let characteristic = new Float64Array(nItems * nItems);
  for (let i = 0; i <= nItems; i += 1) {
    characteristic = computeMatrixAddition(
      nItems,
      characteristic,
      computeScalarMatrixMultiplication(nItems, polynomial[i], aPowers[i]),
    );
  }
  const controllability = new Float64Array(nItems * nItems);
  for (let j = 0; j < nItems; j += 1) {
    const vector = computeMatrixVectorMultiplication(nItems, aPowers[j], b);
    for (let i = 0; i < nItems; i += 1) {
      controllability[i * nItems + j] = vector[i];
    }
  }
  const k = computeMatrixMatrixMultiplication(
    nItems,
    computeInverseMatrix(nItems, controllability),
    characteristic,
  );
  return {
    cart: new PidParameters(k[12], 0, k[13]),
    pendulum: new PidParameters(k[14], 0, k[15]),
  };
}

export class Controller {
  private pidParameters: PidParameters;
  private computeError: () => number;
  private computeErrorDerivative: () => number;
  private errorSum: number;

  public constructor(
    pidParameters: PidParameters,
    computeError: () => number,
    computeErrorDerivative: () => number,
  ) {
    this.pidParameters = pidParameters;
    this.computeError = computeError;
    this.computeErrorDerivative = computeErrorDerivative;
    this.errorSum = 0;
  }

  public computeExternalForce(dt: number): number {
    const error = this.computeError();
    const errorDerivative = this.computeErrorDerivative();
    this.errorSum += error * dt;
    return (
      this.pidParameters.getP() * error +
      this.pidParameters.getI() * this.errorSum +
      this.pidParameters.getD() * errorDerivative
    );
  }

  public getPidParameters(): PidParameters {
    return this.pidParameters;
  }
}
