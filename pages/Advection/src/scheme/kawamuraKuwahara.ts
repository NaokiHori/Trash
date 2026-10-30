import { BaseScheme } from "./base";

const N_HALO = 2;

export class KawamuraKuwaharaScheme extends BaseScheme {
  public label = "Kawamura-Kuwahara";
  private values: Array<number>;
  private dValues: Array<number>;

  public constructor(length: number, nitems: number) {
    super(length, nitems);
    const values = new Array<number>();
    const dValues = new Array<number>();
    this.initializeValues(N_HALO, values);
    for (let i = 0; i < nitems + 2 * N_HALO; i += 1) {
      dValues.push(0);
    }
    this.values = values;
    this.dValues = dValues;
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
    const dx = this.getDx();
    const dt = this.getDt();
    const coef = (velocity * dt) / dx;
    if (velocity < 0) {
      for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
        dValues[i] =
          (coef / 6) *
          (values[i - 2] -
            2 * values[i - 1] +
            9 * values[i] -
            10 * values[i + 1] +
            2 * values[i + 2]);
      }
    } else {
      for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
        dValues[i] =
          (-coef / 6) *
          (2 * values[i - 2] -
            10 * values[i - 1] +
            9 * values[i] -
            2 * values[i + 1] +
            values[i + 2]);
      }
    }
    for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
      values[i] += dValues[i];
    }
    this.exchangeHalo(N_HALO, values);
  }
}
