import { Animation } from "../../common/animation";
import { getElementByIdOrThrow } from "../../common/dom";
import { CellularAutomaton } from "./cellularAutomaton";

function handleResizeEvent(canvas: HTMLCanvasElement) {
  const rect: DOMRect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

function main() {
  const canvas = getElementByIdOrThrow(HTMLCanvasElement, "field");
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
