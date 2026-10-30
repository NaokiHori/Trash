import { getElementByIdOrThrow } from "./dom";
import { Equations } from "./equation";

function renderOffScreen(
  width: number,
  equations: {
    red: (value: number) => number;
    green: (value: number) => number;
    blue: (value: number) => number;
  },
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = 1;
  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error("Failed to get off-screen canvas context");
  }
  const imageData = ctx.createImageData(width, 1);
  const data = imageData.data;
  for (let i = 0; i < width; i += 1) {
    const value = i / (width - 1);
    const r = equations.red(value);
    const g = equations.green(value);
    const b = equations.blue(value);
    data[4 * i + 0] = Math.trunc(255 * r);
    data[4 * i + 1] = Math.trunc(255 * g);
    data[4 * i + 2] = Math.trunc(255 * b);
    data[4 * i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export class ColorMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public constructor({ elementId }: { elementId: string }) {
    const canvas = getElementByIdOrThrow(HTMLCanvasElement, elementId);
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (null === ctx) {
      throw new Error("Failed to get context");
    }
    this.canvas = canvas;
    this.ctx = ctx;
  }

  public draw(equations: Equations): void {
    const canvas: HTMLCanvasElement = this.canvas;
    const ctx: CanvasRenderingContext2D = this.ctx;
    const width = canvas.width;
    const height = canvas.height;
    const offscreenCanvas = renderOffScreen(width, equations);
    ctx.drawImage(offscreenCanvas, 0, 0, width, height);
  }
}
