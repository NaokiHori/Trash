import { BaseScheme } from "./base";

const N_HALO = 2;

function fluxLimiter(num: number, den: number): number {
  if (0 === den) {
    if (num < 0) {
      return 0;
    }
    return 1;
  }
  const r = num / den;
  // minmod flux limiter
  return Math.max(0, Math.min(1, r));
}

export class MusclScheme extends BaseScheme {
  public label = "MUSCL";
  private values: Array<number>;
  private dValues: Array<number>;
  private fluxes: Array<number>;

  public constructor(length: number, nitems: number) {
    super(length, nitems);
    const values = new Array<number>();
    const dValues = new Array<number>();
    const fluxes = new Array<number>();
    this.initializeValues(N_HALO, values);
    for (let i = 0; i < nitems + 2 * N_HALO; i += 1) {
      dValues.push(0);
      fluxes.push(0);
    }
    this.values = values;
    this.dValues = dValues;
    this.fluxes = fluxes;
    this.exchangeHalo(N_HALO, values);
  }

  public getArray(): Readonly<Array<number>> {
    return this.getArrayInternal(N_HALO, this.values);
  }

  public integrate(): void {
    const velocity = this.getVelocity();
    const nitems = this.getNitems();
    const values = this.values;
    const dValues = this.dValues;
    const fluxes = this.fluxes;
    const dx = this.getDx();
    const dt = this.getDt();
    if (velocity < 0) {
      for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
        fluxes[i] =
          velocity *
          (values[i] -
            0.5 *
              fluxLimiter(values[i] - values[i - 1], values[i + 1] - values[i]) *
              (values[i + 1] - values[i]));
      }
    } else {
      for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
        fluxes[i] =
          velocity *
          (values[i - 1] +
            0.5 *
              fluxLimiter(values[i - 1] - values[i - 2], values[i] - values[i - 1]) *
              (values[i] - values[i - 1]));
      }
    }
    this.exchangeHalo(N_HALO, fluxes);
    for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
      dValues[i] = ((fluxes[i] - fluxes[i + 1]) / dx) * dt;
    }
    for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
      values[i] += dValues[i];
    }
    this.exchangeHalo(N_HALO, values);
  }
}
