import { X_LIMITS, Y_LIMITS } from "../param";
import { getElementByIdOrThrow } from "../dom";
import { Dataset } from "../dataset";

export class CanvasElement {
  private canvasElement: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  public constructor(elementId: string) {
    const canvasElement = getElementByIdOrThrow(HTMLCanvasElement, elementId);
    const context = canvasElement.getContext("2d");
    if (null === context) {
      throw new Error();
    }
    this.canvasElement = canvasElement;
    this.context = context;
  }

  public setWidth(width: number): void {
    this.canvasElement.width = width;
  }

  public setHeight(height: number): void {
    this.canvasElement.height = height;
  }

  public draw(dataset: Dataset): void {
    const context = this.context;
    const nPx = this.canvasElement.width;
    const nPy = this.canvasElement.height;
    const imageData = context.createImageData(nPx, nPy);
    const data = new Uint32Array(imageData.data.buffer);
    const red = 0xffc8c8ff;
    const blue = 0xffffc8c8;
    dataset.updateSupportVectors();
    for (let py = 0; py < nPy; py += 1) {
      const y = (py / nPy) * (Y_LIMITS[1] - Y_LIMITS[0]) + Y_LIMITS[0];
      const rowOffset = py * nPx;
      for (let px = 0; px < nPx; px += 1) {
        const x = (px / nPx) * (X_LIMITS[1] - X_LIMITS[0]) + X_LIMITS[0];
        data[rowOffset + px] = 0 < dataset.categorize([x, y]) ? red : blue;
      }
    }
    context.putImageData(imageData, 0, 0);
  }
}
