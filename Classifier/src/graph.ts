import { getElementByIdOrThrow } from "./dom";
import { Point } from "./graph/point";

export class Graph {
  private graphElement: SVGSVGElement;
  private points: Array<Point>;

  public constructor(elementId: string, nitems: number) {
    const graphElement = getElementByIdOrThrow(SVGSVGElement, elementId);
    const points = new Array<Point>();
    for (let i = 0; i < nitems; i += 1) {
      points.push(new Point(graphElement));
    }
    this.graphElement = graphElement;
    this.points = points;
  }

  public getPoints(): Array<Point> {
    return this.points;
  }

  public getHtmlElement(): SVGSVGElement {
    return this.graphElement;
  }
}
