const SCREEN_SIZE = 100;

function xFromSimulatorToScreen(x: number): number {
  // assume center of the both domains is 0
  return SCREEN_SIZE * x;
}

function yFromSimulatorToScreen(y: number): number {
  // assume center of the both domains is 0
  return -SCREEN_SIZE * y;
}

class SvgItem {
  protected _element: Element;

  public constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    this._element = document.createElementNS(namespaceUri, qualifiedName);
  }

  public remove() {
    this._element.remove();
  }

  public getElement(): Readonly<Element> {
    return this._element;
  }

  protected addClassNames(classNames: Array<string>) {
    for (const className of classNames) {
      this._element.classList.add(className);
    }
  }
}

export class Circle extends SvgItem {
  public constructor(classNames: Array<string>, x: number, y: number) {
    super("circle");
    this._element.setAttribute("r", "2");
    this.setPosition(x, y);
    this.addClassNames(classNames);
  }

  public updatePosition(x: number, y: number) {
    this.setPosition(x, y);
  }

  private setPosition(x: number, y: number) {
    this._element.setAttribute("cx", xFromSimulatorToScreen(x).toString());
    this._element.setAttribute("cy", yFromSimulatorToScreen(y).toString());
  }
}

export class Line extends SvgItem {
  public constructor(classNames: Array<string>, x1: number, y1: number, x2: number, y2: number) {
    super("line");
    this.setPosition(x1, y1, x2, y2);
    this.addClassNames(classNames);
  }

  public updatePosition(x1: number, y1: number, x2: number, y2: number) {
    this.setPosition(x1, y1, x2, y2);
  }

  public setColor(color: string) {
    this._element.setAttribute("style", `stroke: ${color}`);
  }

  private setPosition(x1: number, y1: number, x2: number, y2: number) {
    this._element.setAttribute("x1", xFromSimulatorToScreen(x1).toString());
    this._element.setAttribute("y1", yFromSimulatorToScreen(y1).toString());
    this._element.setAttribute("x2", xFromSimulatorToScreen(x2).toString());
    this._element.setAttribute("y2", yFromSimulatorToScreen(y2).toString());
  }
}
