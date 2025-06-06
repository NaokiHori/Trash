export class BaseScheme {
  private _length: number;
  private _velocity: number;
  private _nitems: number;

  protected constructor(length: number, nitems: number) {
    this._length = length;
    this._velocity = 1;
    this._nitems = nitems;
  }

  public get length(): number {
    return this._length;
  }

  public get velocity(): number {
    return this._velocity;
  }

  public get nitems(): number {
    return this._nitems;
  }

  public flipVelocity() {
    this._velocity *= -1;
  }

  protected getDx(): number {
    return this._length / this._nitems;
  }

  protected getDt(): number {
    const dx = this.getDx();
    return dx / 32 / Math.abs(this._velocity);
  }

  protected initializeValues(n_halo: number, values: Array<number>) {
    const length = this._length;
    const nitems = this._nitems;
    const halfWidth = 0.125;
    const getValue = (x: number): number => {
      return length * (0.5 - halfWidth) < x && x < length * (0.5 + halfWidth)
        ? 1
        : 0;
    };
    for (let i = -n_halo; i < nitems + n_halo; i++) {
      const x = (length * (0.5 * (2 * i + 1))) / nitems;
      const value = getValue(x);
      values.push(value);
    }
  }

  protected _getArray(
    n_halo: number,
    values: Array<number>,
  ): Readonly<Array<number>> {
    const nitems = this._nitems;
    return values.slice(n_halo, nitems + n_halo);
  }

  protected exchangeHalo(n_halo: number, values: Array<number>) {
    const nitems = this._nitems;
    // bulk indices:
    //   [N_HALO : nitems + N_HALO - 1]
    // halo indices:
    //   [0 : N_HALO - 1]
    //   and
    //   [nitems + N_HALO : nitems + 2 * N_HALO - 1]
    for (let i = 0; i < n_halo; i++) {
      values[i] = values[nitems + i];
      values[nitems + n_halo + i] = values[n_halo + i];
    }
  }
}
