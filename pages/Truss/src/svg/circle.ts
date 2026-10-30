import { SvgItem } from "./svgItem";
import { xFromSimulatorToScreen, yFromSimulatorToScreen } from "./util";

export class Circle extends SvgItem {
  public constructor(classNames: Readonly<Array<string>>, x: number, y: number) {
    super("circle");
    this.setElementAttribute("r", "2");
    this.setPosition(x, y);
    this.addClassNames(classNames);
  }

  public updatePosition(x: number, y: number): void {
    this.setPosition(x, y);
  }

  private setPosition(x: number, y: number): void {
    this.setElementAttribute("cx", xFromSimulatorToScreen(x).toString());
    this.setElementAttribute("cy", yFromSimulatorToScreen(y).toString());
  }
}
