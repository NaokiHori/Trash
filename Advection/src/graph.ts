import { getElementById } from "./dom";

class SvgItem {
  protected _element: Element;

  public constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    const element: Element = document.createElementNS(
      namespaceUri,
      qualifiedName,
    );
    this._element = element;
    this._element.setAttribute("visibility", true.toString());
  }

  public remove() {
    this._element.remove();
  }

  public get element(): Readonly<Element> {
    return this._element;
  }
}

class Circle extends SvgItem {
  public constructor() {
    super("circle");
    this._element.setAttribute("r", "5");
    this._element.setAttribute("fill", "#ffff99");
  }

  public set position(position: [number, number]) {
    this._element.setAttribute("cx", position[0].toString());
    this._element.setAttribute("cy", position[1].toString());
  }
}

export class Graph {
  private _element: HTMLElement;
  private _circles: Array<Circle>;
  private _size: { width: number; height: number };

  public constructor(elementId: string, numCircles: number) {
    const element: HTMLElement = getElementById(elementId);
    const circles = new Array<Circle>();
    for (let i = 0; i < numCircles; i++) {
      const circle = new Circle();
      element.appendChild(circle.element);
      circles.push(circle);
    }
    this._element = element;
    this._circles = circles;
    this._size = Graph.getCurrentGraphSize(element);
  }

  public updateCircles(points: Readonly<Array<number>>) {
    if (points.length !== this._circles.length) {
      throw new Error("Lengths mismatch");
    }
    const { width: graphWidth, height: graphHeight } = this.size;
    const numCircles = this._circles.length;
    const circles = this._circles;
    const margin = 0.5;
    for (let i = 0; i < numCircles; i++) {
      const circle = circles[i];
      const point = points[i];
      const x = ((0.5 * (2 * i + 1)) / numCircles) * graphWidth;
      const y = ((1 - point + margin) / (1 + 2 * margin)) * graphHeight;
      circle.position = [x, y];
    }
  }

  public get size(): { width: number; height: number } {
    return this._size;
  }

  public updateGraphSize() {
    this._size = Graph.getCurrentGraphSize(this._element);
  }

  private static getCurrentGraphSize(element: HTMLElement): {
    width: number;
    height: number;
  } {
    const rect: DOMRect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }
}
