import { Simulator } from "./simulator";

function handleResizeEvent(canvas: HTMLCanvasElement) {
  const rect: DOMRect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

function getCanvas(): HTMLCanvasElement {
  const id = "field";
  const canvas = document.getElementById(id);
  if (null === canvas) {
    throw new Error(`failed to get element ${id}`);
  }
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(`element ${id} is not HTMLCanvasElement`);
  }
  return canvas;
}

function main() {
  const canvas = getCanvas();
  handleResizeEvent(canvas);
  const simulator = new Simulator(canvas);
  window.addEventListener("resize", () => {
    handleResizeEvent(canvas);
    simulator.handleResizeEvent(canvas);
    simulator.draw(canvas);
  });
  handleResizeEvent(canvas);
  simulator.handleResizeEvent(canvas);
  simulator.draw(canvas);
}

window.addEventListener("load", (): void => {
  main();
});
