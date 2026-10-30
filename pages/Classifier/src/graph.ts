import { querySelectorOrThrow } from "./dom";
import { Point } from "./graph/point";

export class Graph {
  private graphElement: SVGSVGElement;
  private points: Array<Point>;

  public constructor(query: string, nitems: number) {
    const graphElement = querySelectorOrThrow(SVGSVGElement, query);
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
