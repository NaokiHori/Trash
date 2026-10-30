import { PathElement } from "./pathElement";
import { SvgItem } from "./svgItem";

export class Path extends SvgItem {
  public constructor(pathElements: Readonly<Array<Readonly<PathElement>>>) {
    super("path");
    this.setPathElements(pathElements);
  }

  public setFill(fill: string): void {
    this.element.setAttribute("fill", fill);
  }

  public setStroke(stroke: string): void {
    this.element.setAttribute("stroke", stroke);
  }

  public setStrokeWidth(strokeWidth: number): void {
    this.element.setAttribute("stroke-width", strokeWidth.toString());
  }

  public setStrokeLinecap(strokeLinecap: string): void {
    this.element.setAttribute("stroke-linecap", strokeLinecap);
  }

  private setPathElements(pathElements: Readonly<Array<Readonly<PathElement>>>): void {
    let d = "";
    for (const pathElement of pathElements) {
      d += pathElement.toString();
    }
    this.element.setAttribute("d", d);
  }
}
