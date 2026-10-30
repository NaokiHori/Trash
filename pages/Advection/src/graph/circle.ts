import { SvgItem } from "./svgItem";

export class Circle extends SvgItem {
  public constructor() {
    super("circle");
    this.element.setAttribute("r", "5");
    this.element.setAttribute("fill", "#ffff99");
  }

  public setPosition(position: [number, number]): void {
    this.element.setAttribute("cx", position[0].toString());
    this.element.setAttribute("cy", position[1].toString());
  }
}
