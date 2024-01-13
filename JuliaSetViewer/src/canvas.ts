export class Canvas {
  private _element: HTMLCanvasElement;

  public constructor({ elementId }: { elementId: string }) {
    const element: HTMLElement | null = document.getElementById(elementId);
    if (null === element) {
      throw new Error(`Failed to get element: ${elementId}`);
    }
    this._element = element as HTMLCanvasElement;
  }

  public getWebGLRenderingContext(): WebGLRenderingContext {
    const gl: WebGLRenderingContext | null = this._element.getContext("webgl", {
      preserveDrawingBuffer: true,
    });
    if (null === gl) {
      throw new Error("Failed to get WebGL context");
    }
    return gl;
  }

  public adjustSize() {
    const rect: DOMRect = this._element.getBoundingClientRect();
    this._element.width = rect.width;
    this._element.height = rect.height;
  }

  public get width(): number {
    return this._element.width;
  }

  public get height(): number {
    return this._element.height;
  }

  public saveImage(fileName: string) {
    if (!fileName.endsWith(".jpeg")) {
      console.error("Image file name should ends with '.jpeg'");
      return;
    }
    this._element.toBlob((blob: Blob | null) => {
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
