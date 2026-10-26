export class BaseScheme {
  private length: number;
  private velocity: number;
  private nitems: number;

  protected constructor(length: number, nitems: number) {
    this.length = length;
    this.velocity = 1;
    this.nitems = nitems;
  }

  public getLength(): number {
    return this.length;
  }

  public getVelocity(): number {
    return this.velocity;
  }

  public getNitems(): number {
    return this.nitems;
  }

  public flipVelocity(): void {
    this.velocity *= -1;
  }

  protected getDx(): number {
    return this.length / this.nitems;
  }

  protected getDt(): number {
    const dx = this.getDx();
    return dx / 32 / Math.abs(this.velocity);
  }

  protected initializeValues(n_halo: number, values: Array<number>): void {
    const length = this.length;
    const nitems = this.nitems;
    const halfWidth = 0.125;
    const getValue = (x: number): number => {
      return length * (0.5 - halfWidth) < x && x < length * (0.5 + halfWidth) ? 1 : 0;
    };
    for (let i = -n_halo; i < nitems + n_halo; i += 1) {
      const x = (length * (0.5 * (2 * i + 1))) / nitems;
      const value = getValue(x);
      values.push(value);
    }
  }

  protected getArrayInternal(n_halo: number, values: Array<number>): Readonly<Array<number>> {
    const nitems = this.nitems;
    return values.slice(n_halo, nitems + n_halo);
  }

  protected exchangeHalo(n_halo: number, values: Array<number>): void {
    const nitems = this.nitems;
    // bulk indices:
    //   [N_HALO : nitems + N_HALO - 1]
    // halo indices:
    //   [0 : N_HALO - 1]
    //   and
    //   [nitems + N_HALO : nitems + 2 * N_HALO - 1]
    for (let i = 0; i < n_halo; i += 1) {
      values[i] = values[nitems + i];
      values[nitems + n_halo + i] = values[n_halo + i];
    }
  }
}
