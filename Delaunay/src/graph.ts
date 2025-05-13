import { getElementById } from "./dom";
import { Point, Triangle } from "./types";

class SvgItem {
  protected _element: Element;

  public constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    const element: Element = document.createElementNS(
      namespaceUri,
      qualifiedName,
    );
    this._element = element;
    this.isDisplayed = false;
  }

  public remove() {
    this._element.remove();
  }

  public get element(): Readonly<Element> {
    return this._element;
  }

  public set isDisplayed(flag: boolean) {
    const attr = flag ? "visible" : "hidden";
    this._element.setAttribute("visibility", attr);
  }
}

class Circle extends SvgItem {
  public constructor() {
    super("circle");
    this._element.setAttribute("r", "5");
    this._element.setAttribute("fill", "#ffff99");
  }

  public set position(position: Point) {
    this._element.setAttribute("cx", position.x.toString());
    this._element.setAttribute("cy", position.y.toString());
  }
}

class Polygon extends SvgItem {
  public constructor() {
    super("polygon");
    this._element.setAttribute("fill", "none");
    this._element.setAttribute("stroke", "#ffffff");
  }

  public set position(points: Triangle) {
    const attr = points.reduce((attr: string, point: Point) => {
      const x = point.x;
      const y = point.y;
      return attr + `${x.toString()} ${y.toString()} `;
    }, "");
    this._element.setAttribute("points", attr);
  }
}

export class Graph {
  private _element: HTMLElement;
  private _circles: Array<Circle>;
  private _numActivePolygons: number;
  private _polygons: Array<Polygon>;
  private _size: { width: number; height: number };

  public constructor(elementId: string) {
    const element: HTMLElement = getElementById(elementId);
    this._element = element;
    this._circles = new Array<Circle>();
    this._numActivePolygons = 0;
    this._polygons = new Array<Polygon>();
    this._size = Graph.getCurrentGraphSize(element);
  }

  public get size(): { width: number; height: number } {
    return this._size;
  }

  public updateGraphSize() {
    this._size = Graph.getCurrentGraphSize(this._element);
  }

  public addCircle(point: Point) {
    const circle = new Circle();
    circle.position = point;
    circle.isDisplayed = true;
    this._element.appendChild(circle.element);
    this._circles.push(circle);
  }

  public addPolygon(triangle: Triangle) {
    const reusePolygon = this._numActivePolygons < this._polygons.length;
    const polygon = reusePolygon
      ? this._polygons[this._numActivePolygons]
      : new Polygon();
    polygon.position = triangle;
    polygon.isDisplayed = true;
    if (!reusePolygon) {
      this._element.appendChild(polygon.element);
      this._polygons.push(polygon);
    }
    this._numActivePolygons += 1;
  }

  public resetCircles() {
    for (const circle of this._circles) {
      this._element.removeChild(circle.element);
      circle.remove();
    }
    this._circles = new Array<Circle>();
  }

  public resetPolygons() {
    for (const polygon of this._polygons) {
      this._element.removeChild(polygon.element);
      polygon.remove();
    }
    this._polygons = new Array<Polygon>();
  }

  public hidePolygons() {
    for (const polygon of this._polygons) {
      polygon.isDisplayed = false;
    }
    this._numActivePolygons = 0;
  }

  private static getCurrentGraphSize(element: HTMLElement): {
    width: number;
    height: number;
  } {
    const rect: DOMRect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }
}
