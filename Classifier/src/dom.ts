export { ButtonElement } from "./dom/buttonElement";
export { CanvasElement } from "./dom/canvasElement";
export { DivElement } from "./dom/divElement";

export function getElementByIdOrThrow<T extends Element>(
  type: new (...args: unknown[]) => T,
  id: string,
): T {
  const element = document.querySelector(`#${id}`);
  if (null === element) {
    throw new Error();
  }
  if (!(element instanceof type)) {
    throw new Error();
  }
  return element;
}
