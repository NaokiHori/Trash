import { BaseScheme } from "./base";

const N_HALO = 3;

const MAX_STENCIL_SIZE = 3;

export class EnoScheme extends BaseScheme {
  public label = "ENO";
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

  private static computeDividedDifference(
    dx: number,
    values: Readonly<Array<number>>,
  ): number {
    const nitems = values.length;
    if (nitems < 2) {
      return values[0];
    }
    return (
      (EnoScheme.computeDividedDifference(dx, values.slice(1)) -
        EnoScheme.computeDividedDifference(dx, values.slice(0, -1))) /
      (nitems - 1) /
      dx
    );
  }

  private static compare(left: number, right: number): boolean {
    return Math.abs(left) < Math.abs(right);
  }

  public integrate() {
    const velocity = this.velocity;
    const nitems = this.nitems;
    const values = this.values;
    const fluxes = this.fluxes;
    const dx = this.getDx();
    const dt = this.getDt();
    const weightsList = [
      [2 / 6, -7 / 6, 11 / 6],
      [-1 / 6, 5 / 6, 2 / 6],
      [2 / 6, 5 / 6, -1 / 6],
      [11 / 6, -7 / 6, 2 / 6],
    ];
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      let iStart = velocity < 0 ? i : i - 1;
      for (let width = 1; width < MAX_STENCIL_SIZE; width++) {
        const iEnd = iStart + width;
        if (
          EnoScheme.compare(
            EnoScheme.computeDividedDifference(
              dx,
              values.slice(iStart - 1, iEnd),
            ),
            EnoScheme.computeDividedDifference(
              dx,
              values.slice(iStart, iEnd + 1),
            ),
          )
        ) {
          iStart -= 1;
        }
      }
      fluxes[i] =
        velocity *
        computeInnerProduct(
          values.slice(iStart, iStart + MAX_STENCIL_SIZE),
          weightsList[iStart + MAX_STENCIL_SIZE - i],
        );
    }
    this.exchangeHalo(N_HALO, fluxes);
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      values[i] += ((fluxes[i] - fluxes[i + 1]) / dx) * dt;
    }
    this.exchangeHalo(N_HALO, values);
  }
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
