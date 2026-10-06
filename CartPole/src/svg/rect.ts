import { SvgItem } from "./svgItem";
import { xFromSimulatorToScreen, yFromSimulatorToScreen } from "./util";

export class Rect extends SvgItem {
  private width: number = 0.02;
  private height: number = 0.01;

  public constructor(classNames: Array<string>, cx: number, cy: number) {
    super("rect");
    this.setPosition(cx, cy);
    this.addClassNames(classNames);
    this.element.setAttribute("width", xFromSimulatorToScreen(this.width).toString());
    this.element.setAttribute("height", xFromSimulatorToScreen(this.height).toString());
  }

  public updatePosition(cx: number, cy: number): void {
    this.setPosition(cx, cy);
  }

  private setPosition(cx: number, cy: number): void {
    this.element.setAttribute("x", xFromSimulatorToScreen(cx - 0.5 * this.width).toString());
    this.element.setAttribute("y", yFromSimulatorToScreen(cy + 0.5 * this.height).toString());
  }
}
