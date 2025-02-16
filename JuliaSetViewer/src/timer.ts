export class Timer {
  private _counter: number;
  private _per: number;
  private _start_at: number;
  private _onReset: () => void;

  public constructor(per: number, onTimerReset: () => void) {
    this._counter = 0;
    this._per = per;
    this._start_at = 0;
    this._onReset = onTimerReset;
  }

  public start() {
    this._start_at = performance.now();
  }

  public update() {
    this._counter += 1;
    if (this._per < performance.now() - this._start_at) {
      console.log(
        `${this._counter.toString()} animation loops per ${this._per.toString()} ms`,
      );
      this._onReset();
      this._counter = 0;
      this._start_at = performance.now();
    }
  }
}
