import { SvgItem } from "./svgItem";

export class Text extends SvgItem {
  public constructor(value: string, x: number, y: number, color: string) {
    super("text");
    this.element.textContent = value;
    this.setPosition(x, y);
    this.element.setAttribute("text-anchor", "middle");
    this.element.setAttribute("fill", color);
  }

  private setPosition(x: number, y: number): void {
    this.element.setAttribute("x", x.toString());
    this.element.setAttribute("y", y.toString());
  }
}
