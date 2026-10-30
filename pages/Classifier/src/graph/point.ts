import { X_LIMITS, Y_LIMITS } from "../param";

const NAMESPACE_URI = "http://www.w3.org/2000/svg";

function getGraphSize(parentElement: SVGSVGElement): {
  width: number;
  height: number;
} {
  const rect: DOMRect = parentElement.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

function convertX(parentElement: SVGSVGElement, x: number): number {
  const { width } = getGraphSize(parentElement);
  return ((x - X_LIMITS[0]) / (X_LIMITS[1] - X_LIMITS[0])) * width;
}

function convertY(parentElement: SVGSVGElement, y: number): number {
  const { height } = getGraphSize(parentElement);
  return ((y - Y_LIMITS[0]) / (Y_LIMITS[1] - Y_LIMITS[0])) * height;
}

export class Point {
  private parentElement: SVGSVGElement;
  private element: Element;
  private isDisplayed: boolean;

  public constructor(parentElement: SVGSVGElement) {
    const element: Element = document.createElementNS(NAMESPACE_URI, "circle");
    this.parentElement = parentElement;
    this.element = element;
    this.isDisplayed = false;
    this.setIsHighlighted(true);
  }

  public show(): void {
    if (this.isDisplayed) {
      return;
    }
    this.parentElement.append(this.element);
    this.isDisplayed = true;
  }

  public setPosition(position: [number, number]): void {
    this.element.setAttribute("cx", convertX(this.parentElement, position[0]).toString());
    this.element.setAttribute("cy", convertY(this.parentElement, position[1]).toString());
  }

  public setColor(value: string): void {
    this.element.setAttribute("fill", value);
  }

  public setIsHighlighted(value: boolean): void {
    const { width, height } = getGraphSize(this.parentElement);
    const radius = Math.min(width, height) / (value ? 96 : 192);
    this.element.setAttribute("r", radius.toString());
  }
}
