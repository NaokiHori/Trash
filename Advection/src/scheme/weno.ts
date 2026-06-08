import { BaseScheme } from "./base";

const N_HALO = 3;

const MAX_STENCIL_SIZE = 3;

export class WenoScheme extends BaseScheme {
  public label = "WENO";
  private values: Array<number>;
  private fluxes: Array<number>;

  public constructor(length: number, nitems: number) {
    super(length, nitems);
    const values = new Array<number>();
    const fluxes = new Array<number>();
    this.initializeValues(N_HALO, values);
    this.exchangeHalo(N_HALO, values);
    this.values = values;
    this.fluxes = fluxes;
  }

  public getArray(): Readonly<Array<number>> {
    return this._getArray(N_HALO, this.values);
  }

  public integrate() {
    const velocity = this.velocity;
    const nitems = this.nitems;
    const values = this.values;
    const fluxes = this.fluxes;
    const dx = this.getDx();
    const dt = this.getDt();
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      const isNegativeFlow = velocity < 0;
      const localValues: [number, number, number, number, number] =
        isNegativeFlow
          ? [
              values[i + 2],
              values[i + 1],
              values[i],
              values[i - 1],
              values[i - 2],
            ]
          : [
              values[i - 3],
              values[i - 2],
              values[i - 1],
              values[i],
              values[i + 1],
            ];
      fluxes[i] = velocity * computeCellFaceValue(localValues);
    }
    this.exchangeHalo(N_HALO, fluxes);
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      values[i] += ((fluxes[i] - fluxes[i + 1]) / dx) * dt;
    }
    this.exchangeHalo(N_HALO, values);
  }
}

function computeCellFaceValue(
  localValues: [number, number, number, number, number],
): number {
  const EPSILON = 1e-6;
  const gammas = [1 / 10, 3 / 5, 3 / 10];
  const betas = [
    (13 / 12) * (localValues[0] - 2 * localValues[1] + localValues[2]) ** 2 +
      (1 / 4) * (localValues[0] - 4 * localValues[1] + 3 * localValues[2]) ** 2,
    (13 / 12) * (localValues[1] - 2 * localValues[2] + localValues[3]) ** 2 +
      (1 / 4) * (localValues[1] - localValues[3]) ** 2,
    (13 / 12) * (localValues[2] - 2 * localValues[3] + localValues[4]) ** 2 +
      (1 / 4) * (3 * localValues[2] - 4 * localValues[3] + localValues[4]) ** 2,
  ];
  const alphas = [
    gammas[0] / (EPSILON + betas[0]) ** 2,
    gammas[1] / (EPSILON + betas[1]) ** 2,
    gammas[2] / (EPSILON + betas[2]) ** 2,
  ];
  const sumAlphas = alphas[0] + alphas[1] + alphas[2];
  const weights = [
    alphas[0] / sumAlphas,
    alphas[1] / sumAlphas,
    alphas[2] / sumAlphas,
  ];
  return (
    weights[0] *
      computeInnerProduct(localValues.slice(0, 3), [2 / 6, -7 / 6, 11 / 6]) +
    weights[1] *
      computeInnerProduct(localValues.slice(1, 4), [-1 / 6, 5 / 6, 2 / 6]) +
    weights[2] *
      computeInnerProduct(localValues.slice(2, 5), [2 / 6, 5 / 6, -1 / 6])
  );
}

function computeInnerProduct(
  a: Readonly<Array<number>>,
  b: Readonly<Array<number>>,
): number {
  let result = 0;
  for (let i = 0; i < MAX_STENCIL_SIZE; i++) {
    result += a[i] * b[i];
  }
  return result;
}
