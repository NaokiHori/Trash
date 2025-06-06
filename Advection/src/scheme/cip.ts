import { BaseScheme } from "./base";

const N_HALO = 1;

export class CipScheme extends BaseScheme {
  public label = "CIP";
  private _values: Array<number>;
  private _grads: Array<number>;
  private _dValues: Array<number>;
  private _dGrads: Array<number>;

  public constructor(length: number, nitems: number) {
    super(length, nitems);
    const values = new Array<number>();
    const grads = new Array<number>();
    const dValues = new Array<number>();
    const dGrads = new Array<number>();
    this.initializeValues(N_HALO, values);
    this.exchangeHalo(N_HALO, values);
    for (let i = 0; i < nitems + 2 * N_HALO; i++) {
      dValues.push(0);
      dGrads.push(0);
    }
    const dx = this.getDx();
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      grads[i] = (0.5 / dx) * (-values[i - 1] + values[i + 1]);
    }
    this.exchangeHalo(N_HALO, grads);
    this._values = values;
    this._grads = grads;
    this._dValues = dValues;
    this._dGrads = dGrads;
  }

  public getArray(): Readonly<Array<number>> {
    return this._getArray(N_HALO, this._values);
  }

  public integrate() {
    const velocity = this.velocity;
    const nitems = this.nitems;
    const values = this._values;
    const grads = this._grads;
    const dValues = this._dValues;
    const dGrads = this._dGrads;
    const dx = this.getDx();
    const dt = this.getDt();
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      const d = velocity < 0 ? dx : -dx;
      const g = grads[i];
      const gup = velocity < 0 ? grads[i + 1] : grads[i - 1];
      const f = values[i];
      const fup = velocity < 0 ? values[i + 1] : values[i - 1];
      const a = (2 * (f - fup)) / d ** 3 + (g + gup) / d ** 2;
      const b = (3 * (fup - f)) / d ** 2 - (2 * g + gup) / d;
      const x = -velocity * dt;
      dValues[i] = a * x ** 3 + b * x ** 2 + g * x;
      dGrads[i] = 3 * a * x ** 2 + 2 * b * x;
    }
    for (let i = N_HALO; i < nitems + N_HALO; i++) {
      values[i] += dValues[i];
      grads[i] += dGrads[i];
    }
    this.exchangeHalo(N_HALO, values);
    this.exchangeHalo(N_HALO, grads);
  }
}
