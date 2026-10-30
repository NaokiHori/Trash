import { BaseScheme } from "./base";

const N_HALO = 1;

const BETA = 1;

function isBulk(value: number): boolean {
  const SMALL = 1e-8;
  return value < SMALL || 1 - SMALL < value;
}

function indicator(a: number, b: number, x: number): number {
  const surfaceFunction = a * x + b;
  return 0.5 * (1 + Math.tanh(BETA * surfaceFunction));
}

export class ThincScheme extends BaseScheme {
  public label = "THINC";
  private normals: Array<number>;
  private intercepts: Array<number>;
  private values: Array<number>;
  private dValues: Array<number>;
  private fluxes: Array<number>;

  public constructor(length: number, nitems: number) {
    super(length, nitems);
    const normals = new Array<number>();
    const intercepts = new Array<number>();
    const values = new Array<number>();
    const dValues = new Array<number>();
    const fluxes = new Array<number>();
    this.initializeValues(N_HALO, values);
    for (let i = 0; i < nitems + 2 * N_HALO; i += 1) {
      normals.push(0);
      intercepts.push(0);
      dValues.push(0);
      fluxes.push(0);
    }
    this.normals = normals;
    this.intercepts = intercepts;
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
    const normals = this.normals;
    const intercepts = this.intercepts;
    const values = this.values;
    const dValues = this.dValues;
    const fluxes = this.fluxes;
    const dx = this.getDx();
    const dt = this.getDt();
    for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
      if (isBulk(values[i])) {
        normals[i] = 0;
        intercepts[i] = 0;
      } else {
        const ns = [values[i - 1] < values[i] ? 1 : -1, values[i] < values[i + 1] ? 1 : -1];
        const n = 0.5 * ns[0] + 0.5 * ns[1];
        normals[i] = n / Math.max(Math.abs(n), Number.EPSILON);
        intercepts[i] = (-0.5 / BETA) * Math.log(1 / values[i] - 1);
      }
    }
    this.exchangeHalo(N_HALO, normals);
    this.exchangeHalo(N_HALO, intercepts);
    for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
      const isNegative = velocity < 0;
      const ii = isNegative ? i : i - 1;
      const x = isNegative ? -0.5 : 0.5;
      if (isBulk(values[ii])) {
        fluxes[i] = velocity * values[ii];
      } else {
        fluxes[i] = velocity * indicator(normals[ii], intercepts[ii], x);
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
