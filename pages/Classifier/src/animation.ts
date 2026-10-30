export class Animation {
  private interFrameMs: number;
  private lastTime: DOMHighResTimeStamp;
  private counter: number;
  private callback: (counter: number) => void;
  private isRunning: boolean;

  public constructor(maxFps: number, callback: (counter: number) => void) {
    this.interFrameMs = 1000 / maxFps;
    this.lastTime = 0;
    this.counter = 0;
    this.callback = callback;
    this.isRunning = false;
  }

  public start(): void {
    if (this.isRunning) {
      // avoid double running
      return;
    }
    const proceed = (currentTime: number): void => {
      if (!this.isRunning) {
        // to stop animation loop
        return;
      }
      const elapsed = currentTime - this.lastTime;
      if (this.interFrameMs < elapsed) {
        this.lastTime = currentTime;
        this.callback(this.counter);
        this.counter += 1;
      }
      requestAnimationFrame(proceed);
    };
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(proceed);
  }

  public stop(): void {
    this.isRunning = false;
  }
}
