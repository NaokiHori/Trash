import { SvgItem } from "./svgItem";

export class Rect extends SvgItem {
  public constructor(x: number, y: number, width: number, height: number) {
    super("rect");
    this.setPosition(x, y, width, height);
  }

  public setFill(fill: string): void {
    this.element.setAttribute("fill", fill);
  }

  private setPosition(x: number, y: number, width: number, height: number): void {
    this.element.setAttribute("x", x.toString());
    this.element.setAttribute("y", y.toString());
    this.element.setAttribute("width", width.toString());
    this.element.setAttribute("height", height.toString());
  }
}
