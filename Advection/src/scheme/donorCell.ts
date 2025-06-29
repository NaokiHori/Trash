import { BaseScheme } from "./base";

const N_HALO = 1;

export class DonorCellScheme extends BaseScheme {
  public label = "Donor-Cell";
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
    }
    for (let i = 0; i < nitems + 1; i++) {
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
        fluxes[i] = velocity * values[i];
      }
    } else {
      for (let i = N_HALO; i < nitems + N_HALO; i++) {
        fluxes[i] = velocity * values[i - 1];
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
