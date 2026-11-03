import { getElementByIdOrThrow } from "../../common/dom";

export class Canvas {
  private element: HTMLCanvasElement;

  public constructor({ elementId }: { elementId: string }) {
    this.element = getElementByIdOrThrow(HTMLCanvasElement, elementId);
  }

  public getWebGL2RenderingContext(): WebGL2RenderingContext {
    const gl: WebGL2RenderingContext | null = this.element.getContext("webgl2", {
      preserveDrawingBuffer: true,
    });
    if (null === gl) {
      throw new Error("Failed to get WebGL context");
    }
    return gl;
  }

  public adjustSize(): void {
    const rect: DOMRect = this.element.getBoundingClientRect();
    this.element.width = rect.width;
    this.element.height = rect.height;
  }

  public getWidth(): number {
    return this.element.width;
  }

  public getHeight(): number {
    return this.element.height;
  }

  public saveImage(fileName: string): void {
    if (!fileName.endsWith(".jpeg")) {
      console.error("Image file name should ends with '.jpeg'");
      return;
    }
    this.element.toBlob((blob: Blob | null) => {
      if (null === blob) {
        console.error("Failed to create Blob from canvas");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/jpeg");
  }
}
