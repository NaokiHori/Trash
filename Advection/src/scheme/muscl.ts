import { BaseScheme } from "./base";

const N_HALO = 2;

export class MusclScheme extends BaseScheme {
  public label = "MUSCL";
  private _values: Array<number>;
  private _dValues: Array<number>;
  private _fluxes: Array<number>;

  public constructor(length: number, nitems: number) {
    super(length, nitems);
    const values = new Array<number>();
    const dValues = new Array<number>();
    const fluxes = new Array<number>();
    this.initializeValues(N_HALO, values);
    for (let i = 0; i < nitems + 2 * N_HALO; i++) {
      dValues.push(0);
      fluxes.push(0);
    }
    this._values = values;
    this._dValues = dValues;
    this._fluxes = fluxes;
    this.exchangeHalo(N_HALO, values);
  }

  public getArray(): Readonly<Array<number>> {
    return this._getArray(N_HALO, this._values);
  }

  public integrate() {
    const velocity = this.velocity;
    const nitems = this.nitems;
    const values = this._values;
    const dValues = this._dValues;
    const fluxes = this._fluxes;
    const dx = this.getDx();
    const dt = this.getDt();
    if (velocity < 0) {
      for (let i = N_HALO; i < nitems + N_HALO; i++) {
        fluxes[i] =
          velocity *
          (values[i] -
            0.5 *
              fluxLimiter(
                values[i] - values[i - 1],
                values[i + 1] - values[i],
              ) *
              (values[i + 1] - values[i]));
      }
    } else {
      for (let i = N_HALO; i < nitems + N_HALO; i++) {
        fluxes[i] =
          velocity *
          (values[i - 1] +
            0.5 *
              fluxLimiter(
                values[i - 1] - values[i - 2],
                values[i] - values[i - 1],
              ) *
              (values[i] - values[i - 1]));
      }
    }
    this.exchangeHalo(N_HALO, fluxes);
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      dValues[i] = ((fluxes[i] - fluxes[i + 1]) / dx) * dt;
    }
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      values[i] += dValues[i];
    }
    this.exchangeHalo(N_HALO, values);
  }
}

function fluxLimiter(num: number, den: number): number {
  if (0 === den) {
    if (num < 0) {
      return 0;
    } else {
      return 1;
    }
  }
  const r = num / den;
  // minmod flux limiter
  return Math.max(0, Math.min(1, r));
}
