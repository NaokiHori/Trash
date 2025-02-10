import { X_LIMITS, Y_LIMITS } from "./param";
import { getElementById } from "./dom";

const NAMESPACE_URI = "http://www.w3.org/2000/svg";

class Point {
  private _parentElement: HTMLElement;
  private _element: Element;
  private _isDisplayed: boolean;

  public constructor(parentElement: HTMLElement) {
    const element: Element = document.createElementNS(NAMESPACE_URI, "circle");
    this._parentElement = parentElement;
    this._element = element;
    this._isDisplayed = false;
    this.isHighlighted = true;
  }

  public show() {
    if (this._isDisplayed) {
      return;
    }
    this._parentElement.appendChild(this._element);
    this._isDisplayed = true;
  }

  public set position(position: [number, number]) {
    this._element.setAttribute(
      "cx",
      convertX(this._parentElement, position[0]).toString(),
    );
    this._element.setAttribute(
      "cy",
      convertY(this._parentElement, position[1]).toString(),
    );
  }

  public set color(value: string) {
    this._element.setAttribute("fill", value);
  }

  public set isHighlighted(value: boolean) {
    const { width, height } = getGraphSize(this._parentElement);
    const radius = Math.min(width, height) / (value ? 96 : 192);
    this._element.setAttribute("r", radius.toString());
  }
}

class LineSegment {
  private _parentElement: HTMLElement;
  private _element: Element;
  private _isDisplayed: boolean;

  public constructor(parentElement: HTMLElement) {
    const element: Element = document.createElementNS(NAMESPACE_URI, "line");
    element.setAttribute("stroke", "black");
    this._parentElement = parentElement;
    this._element = element;
    this._isDisplayed = false;
  }

  public show() {
    if (this._isDisplayed) {
      return;
    }
    this._parentElement.appendChild(this._element);
    this._isDisplayed = true;
  }

  public set position(edges: [[number, number], [number, number]]) {
    this._element.setAttribute(
      "x1",
      convertX(this._parentElement, edges[0][0]).toString(),
    );
    this._element.setAttribute(
      "y1",
      convertY(this._parentElement, edges[0][1]).toString(),
    );
    this._element.setAttribute(
      "x2",
      convertX(this._parentElement, edges[1][0]).toString(),
    );
    this._element.setAttribute(
      "y2",
      convertY(this._parentElement, edges[1][1]).toString(),
    );
  }
}

export class Graph {
  private _graphElement: HTMLElement;
  private _points: Array<Point>;
  private _decisionBoundary: LineSegment;

  public constructor(elementId: string, nitems: number) {
    const graphElement: HTMLElement = getElementById(elementId);
    const points = new Array<Point>();
    for (let i = 0; i < nitems; i++) {
      points.push(new Point(graphElement));
    }
    const decisionBoundary = new LineSegment(graphElement);
    this._graphElement = graphElement;
    this._points = points;
    this._decisionBoundary = decisionBoundary;
  }

  public get decisionBoundary(): LineSegment {
    return this._decisionBoundary;
  }

  public get points(): Array<Point> {
    return this._points;
  }

  public get htmlElement(): HTMLElement {
    return this._graphElement;
  }
}

function convertX(parentElement: HTMLElement, x: number): number {
  const { width } = getGraphSize(parentElement);
  return ((x - X_LIMITS[0]) / (X_LIMITS[1] - X_LIMITS[0])) * width;
}

function convertY(parentElement: HTMLElement, y: number): number {
  const { height } = getGraphSize(parentElement);
  return ((y - Y_LIMITS[0]) / (Y_LIMITS[1] - Y_LIMITS[0])) * height;
}

function getGraphSize(parentElement: HTMLElement): {
  width: number;
  height: number;
} {
  const rect: DOMRect = parentElement.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}
