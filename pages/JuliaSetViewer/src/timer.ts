export class Timer {
  private counter: number;
  private per: number;
  private startAt: number;
  private onReset: () => void;

  public constructor(per: number, onTimerReset: () => void) {
    this.counter = 0;
    this.per = per;
    this.startAt = 0;
    this.onReset = onTimerReset;
  }

  public start(): void {
    this.startAt = performance.now();
  }

  public update(): void {
    this.counter += 1;
    if (this.per < performance.now() - this.startAt) {
      console.log(`${this.counter.toString()} animation loops per ${this.per.toString()} ms`);
      this.onReset();
      this.counter = 0;
      this.startAt = performance.now();
    }
  }
}
