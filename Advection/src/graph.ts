import { getElementById } from "./dom";
import { Circle } from "./graph/circle";

export class Graph {
  private element: HTMLElement;
  private circles: Array<Circle>;
  private size: { width: number; height: number };

  public constructor(elementId: string, numCircles: number) {
    const element: HTMLElement = getElementById(elementId);
    const circles = new Array<Circle>();
    for (let i = 0; i < numCircles; i += 1) {
      const circle = new Circle();
      element.append(circle.getElement());
      circles.push(circle);
    }
    this.element = element;
    this.circles = circles;
    this.size = Graph.getCurrentGraphSize(element);
  }

  public updateCircles(points: Readonly<Array<number>>): void {
    if (points.length !== this.circles.length) {
      throw new Error("Lengths mismatch");
    }
    const { width: graphWidth, height: graphHeight } = this.size;
    const numCircles = this.circles.length;
    const circles = this.circles;
    const margin = 0.5;
    for (let i = 0; i < numCircles; i += 1) {
      const circle = circles[i];
      const point = points[i];
      const x = ((0.5 * (2 * i + 1)) / numCircles) * graphWidth;
      const y = ((1 - point + margin) / (1 + 2 * margin)) * graphHeight;
      circle.setPosition([x, y]);
    }
  }

  public updateGraphSize(): void {
    this.size = Graph.getCurrentGraphSize(this.element);
  }

  private static getCurrentGraphSize(element: HTMLElement): {
    width: number;
    height: number;
  } {
    const rect: DOMRect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }
}
