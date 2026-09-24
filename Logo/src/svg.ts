class SvgItem {
  protected element: Element;

  constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    this.element = document.createElementNS(namespaceUri, qualifiedName);
  }

  remove() {
    this.element.remove();
  }

  getElement(): Readonly<Element> {
    return this.element;
  }
}

export class Rect extends SvgItem {
  constructor(x: number, y: number, width: number, height: number) {
    super("rect");
    this.setPosition(x, y, width, height);
  }

  setFill(fill: string) {
    this.element.setAttribute("fill", fill);
  }

  private setPosition(x: number, y: number, width: number, height: number) {
    this.element.setAttribute("x", x.toString());
    this.element.setAttribute("y", y.toString());
    this.element.setAttribute("width", width.toString());
    this.element.setAttribute("height", height.toString());
  }
}

export interface PathElement {
  toString(): string;
}

export class PathElementM implements PathElement {
  constructor(private point: [number, number]) {}

  toString(): string {
    return `M${this.point[0]} ${this.point[1]}`;
  }
}

export class PathElementS implements PathElement {
  constructor(private points: [[number, number], [number, number]]) {}

  toString(): string {
    return `S${this.points[0][0]} ${this.points[0][1]}, ${this.points[1][0]} ${this.points[1][1]}`;
  }
}

export class Path extends SvgItem {
  constructor(pathElements: Array<Readonly<PathElement>>) {
    super("path");
    this.setPathElements(pathElements);
  }

  setFill(fill: string) {
    this.element.setAttribute("fill", fill);
  }

  setStroke(stroke: string) {
    this.element.setAttribute("stroke", stroke);
  }

  setStrokeWidth(strokeWidth: number) {
    this.element.setAttribute("stroke-width", strokeWidth.toString());
  }

  setStrokeLinecap(strokeLinecap: string) {
    this.element.setAttribute("stroke-linecap", strokeLinecap);
  }

  private setPathElements(pathElements: Array<Readonly<PathElement>>) {
    let d = "";
    pathElements.forEach((pathElement: Readonly<PathElement>) => {
      d += pathElement.toString();
    });
    this.element.setAttribute("d", d);
  }
}

export class Text extends SvgItem {
  constructor(value: string, x: number, y: number, color: string) {
    super("text");
    this.element.textContent = value;
    this.setPosition(x, y);
    this.element.setAttribute("text-anchor", "middle");
    this.element.setAttribute("fill", color);
  }

  private setPosition(x: number, y: number) {
    this.element.setAttribute("x", x.toString());
    this.element.setAttribute("y", y.toString());
  }
}
