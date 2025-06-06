import { BaseScheme } from "./base";

const N_HALO = 2;

export class QuickestScheme extends BaseScheme {
  public label = "QUICKEST";
  private _values: Array<number>;
  private _dValues: Array<number>;

  public constructor(length: number, nitems: number) {
    super(length, nitems);
    const values = new Array<number>();
    const dValues = new Array<number>();
    this.initializeValues(N_HALO, values);
    for (let i = 0; i < nitems + 2 * N_HALO; i++) {
      dValues.push(0);
    }
    this._values = values;
    this._dValues = dValues;
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
    const dx = this.getDx();
    const dt = this.getDt();
    const coef = (velocity * dt) / dx;
    if (velocity < 0) {
      for (let i = N_HALO; i < nitems + N_HALO; i++) {
        dValues[i] = 0;
        dValues[i] +=
          (+coef / 6) *
          (1 * values[i + 2] -
            6 * values[i + 1] +
            3 * values[i] +
            2 * values[i - 1]);
        dValues[i] +=
          (coef ** 2 / 2) * (values[i - 1] - 2 * values[i] + values[i + 1]);
        dValues[i] +=
          (+(coef ** 3) / 6) *
          (-values[i + 2] + 3 * values[i + 1] - 3 * values[i] + values[i - 1]);
      }
    } else {
      for (let i = N_HALO; i < nitems + N_HALO; i++) {
        dValues[i] = 0;
        dValues[i] +=
          (-coef / 6) *
          (1 * values[i - 2] -
            6 * values[i - 1] +
            3 * values[i] +
            2 * values[i + 1]);
        dValues[i] +=
          (coef ** 2 / 2) * (values[i - 1] - 2 * values[i] + values[i + 1]);
        dValues[i] +=
          (-(coef ** 3) / 6) *
          (-values[i - 2] + 3 * values[i - 1] - 3 * values[i] + values[i + 1]);
      }
    }
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      values[i] += dValues[i];
    }
    this.exchangeHalo(N_HALO, values);
  }
}
