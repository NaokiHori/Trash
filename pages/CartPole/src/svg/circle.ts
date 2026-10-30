import { SvgItem } from "./svgItem";
import { xFromSimulatorToScreen, yFromSimulatorToScreen } from "./util";

export class Circle extends SvgItem {
  public constructor(classNames: Array<string>, x: number, y: number) {
    super("circle");
    this.element.setAttribute("r", "0.01");
    this.setPosition(x, y);
    this.addClassNames(classNames);
  }

  public updatePosition(x: number, y: number): void {
    this.setPosition(x, y);
  }

  private setPosition(x: number, y: number): void {
    this.element.setAttribute("cx", xFromSimulatorToScreen(x).toString());
    this.element.setAttribute("cy", yFromSimulatorToScreen(y).toString());
  }
}
