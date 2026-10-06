export class PidParameters {
  private p: number;
  private i: number;
  private d: number;

  public constructor(p: number, i: number, d: number) {
    this.p = p;
    this.i = i;
    this.d = d;
  }

  public getP(): number {
    return this.p;
  }

  public getI(): number {
    return this.i;
  }

  public getD(): number {
    return this.d;
  }
}
