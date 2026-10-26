import { BaseScheme } from "./base";

const N_HALO = 1;

const GAMMA = 1;

function computeSdf(eps: number, value: number): number {
  const clampedValue = Math.min(1 - Number.EPSILON, Math.max(Number.EPSILON, value));
  return eps * Math.log(clampedValue / (1 - clampedValue));
}

export class AcdiScheme extends BaseScheme {
  public label = "ACDI";
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
    const eps = 0.75 * dx;
    for (let i = N_HALO; i < nitems + N_HALO; i += 1) {
      const sdfs = [computeSdf(eps, values[i - 1]), computeSdf(eps, values[i])];
      const sdf = 0.5 * (sdfs[0] + sdfs[1]);
      const normal = sdfs[0] < sdfs[1] ? 1 : sdfs[1] < sdfs[0] ? -1 : 0;
      const adv = -velocity * 0.5 * (values[i - 1] + values[i]);
      const difs = [
        (GAMMA * eps * (-values[i - 1] + values[i])) / dx,
        -GAMMA * 0.25 * (1 - Math.tanh((0.5 / eps) * sdf) ** 2) * normal,
      ];
      fluxes[i] = -adv - difs[0] - difs[1];
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
