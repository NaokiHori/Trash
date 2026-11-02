import { getElementByIdOrThrow } from "./dom";
import { Point, Triangle } from "./types";
import { Circle } from "./graph/circle";
import { Polygon } from "./graph/polygon";

export class Graph {
  private element: HTMLElement;
  private circles: Array<Circle>;
  private numActivePolygons: number;
  private polygons: Array<Polygon>;
  private size: { width: number; height: number };

  public constructor(elementId: string) {
    const element: HTMLElement = getElementByIdOrThrow(elementId);
    this.element = element;
    this.circles = new Array<Circle>();
    this.numActivePolygons = 0;
    this.polygons = new Array<Polygon>();
    this.size = Graph.getCurrentGraphSize(element);
  }

  public getSize(): { width: number; height: number } {
    return this.size;
  }

  public updateGraphSize(): void {
    this.size = Graph.getCurrentGraphSize(this.element);
  }

  public addCircle(point: Point): void {
    const circle = new Circle();
    circle.setPosition(point);
    circle.setIsDisplayed(true);
    this.element.append(circle.getElement());
    this.circles.push(circle);
  }

  public addPolygon(triangle: Triangle): void {
    const reusePolygon = this.numActivePolygons < this.polygons.length;
    const polygon = reusePolygon ? this.polygons[this.numActivePolygons] : new Polygon();
    polygon.setPosition(triangle);
    polygon.setIsDisplayed(true);
    if (!reusePolygon) {
      this.element.append(polygon.getElement());
      this.polygons.push(polygon);
    }
    this.numActivePolygons += 1;
  }

  public resetCircles(): void {
    for (const circle of this.circles) {
      circle.remove();
    }
    this.circles = new Array<Circle>();
  }

  public resetPolygons(): void {
    for (const polygon of this.polygons) {
      polygon.remove();
    }
    this.polygons = new Array<Polygon>();
  }

  public hidePolygons(): void {
    for (const polygon of this.polygons) {
      polygon.setIsDisplayed(false);
    }
    this.numActivePolygons = 0;
  }

  private static getCurrentGraphSize(element: HTMLElement): {
    width: number;
    height: number;
  } {
    const rect: DOMRect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }
}
