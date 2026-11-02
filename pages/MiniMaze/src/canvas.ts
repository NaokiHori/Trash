function getCanvas(): HTMLCanvasElement {
  const id = "canvas";
  const element: HTMLElement | null = document.querySelector(`#${id}`);
  if (element === null) {
    throw new Error(`Failed to get ${id}`);
  }
  if (!(element instanceof HTMLCanvasElement)) {
    throw new TypeError();
  }
  return element;
}

function getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error("The browser does not support canvas element");
  }
  return ctx;
}

export class Canvas {
  private element: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public constructor() {
    const canvas: HTMLCanvasElement = getCanvas();
    const ctx: CanvasRenderingContext2D = getContext(canvas);
    this.element = canvas;
    this.ctx = ctx;
    this.syncSize();
  }

  private syncSize() {
    const element: HTMLCanvasElement = this.element;
    const rect: DOMRect = element.getBoundingClientRect();
    element.width = rect.width;
    element.height = rect.height;
  }

  public getWidth(): number {
    return this.element.width;
  }

  public getHeight(): number {
    return this.element.height;
  }

  public getCtx(): CanvasRenderingContext2D {
    return this.ctx;
  }
}
