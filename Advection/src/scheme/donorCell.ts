import { BaseScheme } from "./base";

const N_HALO = 1;

export class DonorCellScheme extends BaseScheme {
  public label = "Donor-Cell";
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
    }
    for (let i = 0; i < nitems + 1; i += 1) {
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
        fluxes[i] = velocity * values[i];
      }
    } else {
      for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
        fluxes[i] = velocity * values[i - 1];
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
