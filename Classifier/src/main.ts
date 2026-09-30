import { Animation } from "./animation";
import { getNitems } from "./getNitems";
import { ButtonElement, CanvasElement, DivElement } from "./dom";
import { Graph } from "./graph";
import { Sample, Dataset } from "./dataset";
import { getPattern } from "./pattern";

const LOGGER_DEFAULT_MESSAGE = "Click button to proceed";

interface UIComponents {
  button: ButtonElement;
  logger: DivElement;
  graph: Graph;
  canvas: CanvasElement;
}

function setupUI(nitems: number): UIComponents {
  const button = new ButtonElement("proceed-button");
  button.setTextContent("Set points");
  const logger = new DivElement("logger");
  logger.setTextContent(LOGGER_DEFAULT_MESSAGE);
  const graph = new Graph("graph", nitems);
  const canvas = new CanvasElement("contour-canvas");
  canvas.setWidth(128);
  canvas.setHeight(128);
  return { button, logger, graph, canvas };
}

function createInitialAnimation(
  nitems: number,
  dataset: Dataset,
  { button, logger, graph }: UIComponents,
): Animation {
  const initialAnimation = new Animation(120, (counter: number) => {
    if (nitems === counter) {
      button.setDisabled(false);
      button.setTextContent("Start training");
      logger.setTextContent(LOGGER_DEFAULT_MESSAGE);
      initialAnimation.stop();
      return;
    }
    logger.setTextContent(`Setting points: ${counter.toString()} / ${nitems.toString()}`);
    const sample: Sample = dataset.getSample(counter);
    const point = graph.getPoints()[counter];
    const category: number = sample.category;
    point.setPosition([sample.vector[0], sample.vector[1]]);
    point.setColor(category < 0 ? "#0000ff" : "#ff0000");
    point.setIsHighlighted(false);
    point.show();
  });
  return initialAnimation;
}

function createTrainingAnimation(
  nitems: number,
  dataset: Dataset,
  { button, logger, graph, canvas }: UIComponents,
): Animation {
  const trainingAnimation = new Animation(60, () => {
    const isTrainingCompleted = dataset.getIsCompleted();
    if (isTrainingCompleted) {
      button.setTextContent("Training completed");
      logger.setTextContent(`Completed in ${dataset.getStep().toString()} iterations`);
      trainingAnimation.stop();
      return;
    }
    const residual = dataset.train();
    for (let i = 0; i < nitems; i += 1) {
      const point = graph.getPoints()[i];
      point.setIsHighlighted(dataset.isSupportVector(i));
    }
    canvas.draw(dataset);
    logger.setTextContent(
      `Step ${dataset.getStep().toString()} Residual ${residual.toExponential(1)}`,
    );
  });
  return trainingAnimation;
}

function attachEventListeners(
  nitems: number,
  dataset: Dataset,
  ui: UIComponents,
  initialAnimation: Animation,
  trainingAnimation: Animation,
): void {
  ui.button.addEventListener(() => {
    const button = ui.button;
    const clickCounter = button.getClickCounter();
    switch (clickCounter) {
      case 0:
        button.setDisabled(true);
        initialAnimation.start();
        button.setClickCounter(1);
        break;
      case 1:
        button.setDisabled(false);
        button.setTextContent("Stop training");
        trainingAnimation.start();
        button.setClickCounter(2);
        break;
      case 2:
        button.setDisabled(false);
        trainingAnimation.stop();
        button.setTextContent("Restart training");
        button.setClickCounter(1);
        break;
      default:
        throw new Error();
    }
  });
  window.addEventListener("resize", () => {
    for (let i = 0; i < nitems; i += 1) {
      const sample = dataset.getSample(i);
      ui.graph.getPoints()[i].setPosition([sample.vector[0], sample.vector[1]]);
    }
  });
}

function main(): void {
  const nitems = getNitems(256);
  const [categorizer, computeKernel] = getPattern();
  const dataset = new Dataset(nitems, categorizer, computeKernel);
  const ui = setupUI(nitems);
  const initialAnimation = createInitialAnimation(nitems, dataset, ui);
  const trainingAnimation = createTrainingAnimation(nitems, dataset, ui);
  attachEventListeners(nitems, dataset, ui, initialAnimation, trainingAnimation);
}

window.addEventListener("load", () => {
  main();
});
