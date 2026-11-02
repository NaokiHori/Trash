export class Timer {
  increment: number;
  startAt: number;
  onTimerReset: () => void;

  public constructor(increment: number, onTimerReset: () => void) {
    this.increment = increment;
    this.startAt = 0;
    this.onTimerReset = onTimerReset;
  }

  public start(): void {
    this.startAt = performance.now();
  }

  public update(): void {
    const now = performance.now();
    if (this.increment < now - this.startAt) {
      this.onTimerReset();
      this.startAt = now;
    }
  }
}
