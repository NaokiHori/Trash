export function getWebGL2RenderingContext({
  canvas,
}: {
  canvas: HTMLCanvasElement;
}): WebGL2RenderingContext {
  const context: WebGL2RenderingContext | null = canvas.getContext("webgl2");
  if (null === context) {
    throw new Error("Failed to fetch WebGL 2 context");
  }
  return context;
}
