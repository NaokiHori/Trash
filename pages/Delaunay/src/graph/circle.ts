import { Point } from "../types";
import { SvgItem } from "./svgItem";

export class Circle extends SvgItem {
  public constructor() {
    super("circle");
    this.element.setAttribute("r", "5");
    this.element.setAttribute("fill", "#ffff99");
  }

  public setPosition(position: Point) {
    this.element.setAttribute("cx", position.x.toString());
    this.element.setAttribute("cy", position.y.toString());
  }
}
