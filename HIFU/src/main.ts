import { Animation } from "./animation";
import { Simulator } from "./simulator";

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
  const simulator = new Simulator(canvas, false);
  const animation = new Animation(60, () => {
    simulator.update();
    simulator.draw();
  });
  canvas.addEventListener("click", () => {
    if (animation.getIsRunning()) {
      animation.stop();
    } else {
      animation.start();
    }
    simulator.flipIsAnimated();
    simulator.draw();
  });
  window.addEventListener("resize", () => {
    simulator.handleResizeEvent(canvas);
    simulator.draw();
  });
  simulator.handleResizeEvent(canvas);
  simulator.draw();
}

window.addEventListener("load", (): void => {
  main();
});
