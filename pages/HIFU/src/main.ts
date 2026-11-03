import { Animation } from "../../common/animation";
import { getElementByIdOrThrow } from "../../common/dom";
import { Simulator } from "./simulator";

function main(): void {
  const canvas = getElementByIdOrThrow(HTMLCanvasElement, "field");
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
