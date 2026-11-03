import { Animation } from "../../common/animation";
import { CellularAutomaton } from "./cellularAutomaton";

function handleResizeEvent(canvas: HTMLCanvasElement) {
  const rect: DOMRect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

function getCanvas(): HTMLCanvasElement {
  const id = "field";
  const canvas = document.querySelector(`#${id}`);
  if (null === canvas) {
    throw new Error(`failed to get element ${id}`);
  }
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new TypeError();
  }
  return canvas;
}

function main() {
  const canvas = getCanvas();
  handleResizeEvent(canvas);
  const cellularAutomaton = new CellularAutomaton(canvas);
  window.addEventListener("resize", () => {
    handleResizeEvent(canvas);
    cellularAutomaton.handleResizeEvent(canvas);
  });
  handleResizeEvent(canvas);
  cellularAutomaton.handleResizeEvent(canvas);
  const animation = new Animation(60, () => {
    cellularAutomaton.update();
    cellularAutomaton.draw(canvas);
  });
  animation.start();
}

window.addEventListener("load", (): void => {
  main();
});
