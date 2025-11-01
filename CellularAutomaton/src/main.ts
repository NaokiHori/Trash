import { Timer } from "./timer";
import { CellularAutomaton } from "./cellularAutomaton";

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
  return canvas as HTMLCanvasElement;
}

function draw(timer: Timer) {
  timer.update();
  requestAnimationFrame(() => {
    draw(timer);
  });
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
  const timer = new Timer(10, () => {
    cellularAutomaton.update();
    cellularAutomaton.draw(canvas);
  });
  timer.start();
  draw(timer);
}

window.addEventListener("load", (): void => {
  main();
});
