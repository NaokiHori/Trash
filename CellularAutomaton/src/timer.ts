export class Timer {
  _increment: number;
  _startAt: number;
  _onTimerReset: () => void;

  constructor(increment: number, onTimerReset: () => void) {
    this._increment = increment;
    this._startAt = 0;
    this._onTimerReset = onTimerReset;
  }

  public start() {
    this._startAt = performance.now();
  }

  public update() {
    const now = performance.now();
    if (this._increment < now - this._startAt) {
      this._onTimerReset();
      this._startAt = now;
    }
  }
}
