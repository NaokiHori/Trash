import { SvgItem } from "./svgItem";
import { xFromSimulatorToScreen, yFromSimulatorToScreen } from "./util";

export class Line extends SvgItem {
  public constructor(classNames: Array<string>, x1: number, y1: number, x2: number, y2: number) {
    super("line");
    this.setPosition(x1, y1, x2, y2);
    this.addClassNames(classNames);
  }

  public updatePosition(x1: number, y1: number, x2: number, y2: number): void {
    this.setPosition(x1, y1, x2, y2);
  }

  private setPosition(x1: number, y1: number, x2: number, y2: number): void {
    this.element.setAttribute("x1", xFromSimulatorToScreen(x1).toString());
    this.element.setAttribute("y1", yFromSimulatorToScreen(y1).toString());
    this.element.setAttribute("x2", xFromSimulatorToScreen(x2).toString());
    this.element.setAttribute("y2", yFromSimulatorToScreen(y2).toString());
  }
}
