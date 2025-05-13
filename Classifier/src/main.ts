import { X_LIMITS, Y_LIMITS } from "./param";
import { getNitems } from "./getNitems";
import { DivElement } from "./dom";
import { Button } from "./button";
import { Vector } from "./vector";
import { Graph } from "./graph";
import { Dataset, DataPoint } from "./dataset";

const LOGGER_DEFAULT_MESSAGE = "Click button to proceed";

function getLineSegment(
  weights: Readonly<Vector>,
): [[number, number], [number, number]] {
  const intersections: [[number, number], [number, number]] = [
    [0, 0],
    [0, 0],
  ];
  let counter = 0;
  // intersection with Y_LIMITS + y = 0
  for (let pm = 0; pm < 2; pm++) {
    const intersection_x: number =
      -(weights[0] + weights[2] * Y_LIMITS[pm]) / weights[1];
    const intersection_y: number = Y_LIMITS[pm];
    if (X_LIMITS[0] <= intersection_x && intersection_x <= X_LIMITS[1]) {
      intersections[counter][0] = intersection_x;
      intersections[counter][1] = intersection_y;
      counter += 1;
    }
  }
  // intersection with X_LIMITS + x = 0
  for (let pm = 0; pm < 2; pm++) {
    const intersection_x: number = X_LIMITS[pm];
    const intersection_y: number =
      -(weights[0] + weights[1] * X_LIMITS[pm]) / weights[2];
    if (Y_LIMITS[0] <= intersection_y && intersection_y <= Y_LIMITS[1]) {
      intersections[counter][0] = intersection_x;
      intersections[counter][1] = intersection_y;
      counter += 1;
    }
  }
  return intersections;
}

function showPoints(
  nitems: number,
  i: number,
  graph: Graph,
  dataset: Dataset,
  button: Button,
  logger: DivElement,
) {
  if (i === nitems) {
    button.disabled = false;
    button.textContent = "Start training";
    logger.textContent = LOGGER_DEFAULT_MESSAGE;
    return;
  }
  logger.textContent = `Setting points: ${i.toString()} / ${nitems.toString()}`;
  const dataPoint: DataPoint = dataset.getDataPoint(i);
  const point = graph.points[i];
  const vector: Vector = dataPoint.vector;
  const category: number = dataPoint.category;
  point.position = [vector[1], vector[2]];
  point.color = category < 0 ? "#0000ff" : "#ff0000";
  point.show();
  requestAnimationFrame(() => {
    showPoints(nitems, i + 1, graph, dataset, button, logger);
  });
}

function continueTraining(
  nitems: number,
  graph: Graph,
  logger: DivElement,
  dataset: Dataset,
  button: Button,
) {
  const isTrainingCompleted = dataset.isCompleted;
  if (isTrainingCompleted) {
    button.textContent = "Training completed";
    logger.textContent = `Completed in ${dataset.epoch.toString()} iterations`;
    return;
  }
  dataset.train();
  // highlight support vectors (enlarging point size)
  for (let i = 0; i < nitems; i++) {
    const point = graph.points[i];
    point.isHighlighted = dataset.isSupportVector(i);
  }
  graph.decisionBoundary.position = getLineSegment(dataset.weights);
  logger.textContent = `Epoch ${dataset.epoch.toString()}`;
  requestAnimationFrame(() => {
    continueTraining(nitems, graph, logger, dataset, button);
  });
}

function main() {
  const nitems = getNitems(128);
  const dataset = new Dataset(nitems);
  const button = new Button("proceed-button");
  button.textContent = "Set points";
  const logger = new DivElement("logger");
  logger.textContent = LOGGER_DEFAULT_MESSAGE;
  const graph = new Graph("graph", nitems);
  button.onClick([
    (clickedButton: Button) => {
      clickedButton.disabled = true;
      showPoints(nitems, 0, graph, dataset, clickedButton, logger);
    },
    (clickedButton: Button) => {
      clickedButton.disabled = true;
      button.textContent = "Training in progress";
      graph.decisionBoundary.show();
      continueTraining(nitems, graph, logger, dataset, clickedButton);
    },
  ]);
  window.addEventListener("resize", () => {
    for (let i = 0; i < nitems; i++) {
      const dataPoint: Readonly<DataPoint> = dataset.getDataPoint(i);
      graph.points[i].position = [dataPoint.vector[1], dataPoint.vector[2]];
    }
    graph.decisionBoundary.position = getLineSegment(dataset.weights);
  });
}

window.addEventListener("load", () => {
  main();
});
