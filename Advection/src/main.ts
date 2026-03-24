import { Animation } from "./animation";
import { Graph } from "./graph";
import { Scheme } from "./scheme";

function getSpecifiedScheme(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("scheme");
}

function main() {
  const length = 1;
  const nitems = 128;
  const scheme = new Scheme(getSpecifiedScheme(), length, nitems);
  const labelElement = document.getElementById("scheme-label");
  if (labelElement === null) {
    throw new Error("label div element not found");
  }
  const buttons = [
    document.getElementById("to-prev"),
    document.getElementById("to-next"),
  ];
  if (buttons[0] === null) {
    throw new Error("to-prev button not found");
  }
  if (buttons[1] === null) {
    throw new Error("to-next button not found");
  }
  labelElement.addEventListener("click", () => {
    scheme.flipVelocity();
  });
  labelElement.textContent = scheme.getLabel();
  buttons[0].addEventListener("click", () => {
    scheme.toPrev();
    labelElement.textContent = scheme.getLabel();
  });
  buttons[1].addEventListener("click", () => {
    scheme.toNext();
    labelElement.textContent = scheme.getLabel();
  });
  const graph = new Graph("graph", nitems);
  graph.updateGraphSize();
  graph.updateCircles(scheme.getArray());
  const animation = new Animation(60, () => {
    const nIterations = 6;
    for (let i = 0; i < nIterations; i++) {
      scheme.integrate();
    }
    graph.updateCircles(scheme.getArray());
  });
  animation.start();
  window.addEventListener("resize", () => {
    graph.updateGraphSize();
    graph.updateCircles(scheme.getArray());
  });
}

window.addEventListener("load", () => {
  main();
});
