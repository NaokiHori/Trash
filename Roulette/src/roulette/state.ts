import * as Utils from "./util";

const STEP_MAX = 180;

export class RouletteState {
  private readonly nColors: number;
  private position: number;
  private step: number;

  public constructor(members: ReadonlyArray<string>) {
    const nColors = members.length;
    const position = Math.random();
    this.nColors = nColors;
    this.position = position;
    this.step = 0;
  }

  public update() {
    const increment = this.getIncrement();
    this.position = (this.position + increment + 1) % 1;
    this.step += 1;
  }

  public getSelectedIndex(): number {
    return Utils.getSelectedIndex(this.nColors, this.position);
  }

  public isFinalized(): boolean {
    return STEP_MAX < this.step;
  }

  private getIncrement(): number {
    const t_aft = easeOutCubic((this.step + 1) / STEP_MAX);
    const t_bef = easeOutCubic(this.step / STEP_MAX);
    return 2 * Math.PI * (t_aft - t_bef);
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
