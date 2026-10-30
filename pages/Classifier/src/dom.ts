export { CanvasElement } from "./dom/canvasElement";
export { DivElement } from "./dom/divElement";
export { ProceedButton } from "./dom/proceedButton";

export function querySelectorOrThrow<T extends Element>(
  type: new (...args: unknown[]) => T,
  query: string,
): T {
  const element = document.querySelector(query);
  if (null === element) {
    throw new Error();
  }
  if (!(element instanceof type)) {
    throw new Error();
  }
  return element;
}
