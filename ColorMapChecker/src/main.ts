import { getElementByIdOrThrow } from "./dom";
import { ColorMap } from "./colorMap";
import { Graph } from "./graph";
import { ColorSelector } from "./colorSelector";

function getColorSelectors(): {
  red: ColorSelector;
  green: ColorSelector;
  blue: ColorSelector;
} {
  const container = getElementByIdOrThrow(HTMLDivElement, "color-selectors");
  return {
    red: new ColorSelector(container, "red"),
    green: new ColorSelector(container, "green"),
    blue: new ColorSelector(container, "blue"),
  };
}

function updateScreen(
  colorMap: ColorMap,
  graph: Graph,
  colorSelectors: {
    red: ColorSelector;
    green: ColorSelector;
    blue: ColorSelector;
  },
): void {
  colorMap.draw({
    red: colorSelectors.red.equation,
    green: colorSelectors.green.equation,
    blue: colorSelectors.blue.equation,
  });
  graph.draw({
    red: colorSelectors.red.equation,
    green: colorSelectors.green.equation,
    blue: colorSelectors.blue.equation,
  });
}

function main(): void {
  const colorMap = new ColorMap({ elementId: "color-map" });
  const graph = new Graph({ elementId: "graph-canvas" });
  const colorSelectors = getColorSelectors();
  // initial render
  updateScreen(colorMap, graph, colorSelectors);
  // update on select
  colorSelectors.red.setChangeHandler(() => {
    updateScreen(colorMap, graph, colorSelectors);
  });
  colorSelectors.green.setChangeHandler(() => {
    updateScreen(colorMap, graph, colorSelectors);
  });
  colorSelectors.blue.setChangeHandler(() => {
    updateScreen(colorMap, graph, colorSelectors);
  });
  // update on resize
  window.addEventListener("resize", () => {
    updateScreen(colorMap, graph, colorSelectors);
  });
  // switch RGB / HSV on click
  graph.setClickHandler(() => {
    updateScreen(colorMap, graph, colorSelectors);
  });
}

window.addEventListener("load", () => {
  main();
});
