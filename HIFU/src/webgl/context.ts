export function getWebGLRenderingContext({
  canvas,
}: {
  canvas: HTMLCanvasElement;
}): WebGLRenderingContext {
  const context: WebGLRenderingContext | null = canvas.getContext("webgl");
  if (null === context) {
    throw new Error("Failed to fetch WebGL context");
  }
  return context;
}
