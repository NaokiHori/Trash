import { Point, Triangle } from "../types";
import { SvgItem } from "./svgItem";

export class Polygon extends SvgItem {
  public constructor() {
    super("polygon");
    this.element.setAttribute("fill", "none");
    this.element.setAttribute("stroke", "#ffffff");
  }

  public setPosition(points: Triangle): void {
    this.element.setAttribute(
      "points",
      points.reduce((attr: string, point: Point) => {
        const x = point.x;
        const y = point.y;
        return attr + `${x.toString()} ${y.toString()} `;
      }, ""),
    );
  }
}
