import { Button } from "./button";
import { getNitems } from "./getNitems";
import { Graph } from "./graph";
import { Triangulator } from "./triangulator";
import { Point, Triangle } from "./types";

function drawTriangles(graph: Graph, triangles: Array<Triangle>) {
  graph.hidePolygons();
  for (const triangle of triangles) {
    graph.addPolygon(triangle);
  }
}

function setUpPoints(
  nitems: number,
  graph: Graph,
  points: Array<Point>,
  onComplete: () => void,
) {
  const { width, height } = graph.size;
  const margin = 0.02 * Math.min(width, height);
  const initPoint = (): Point => {
    const r = 0.5;
    for (;;) {
      // x in [margin : width  - margin]
      // y in [margin : height - margin]
      const x = margin + Math.random() * (width - 2 * margin);
      const y = margin + Math.random() * (height - 2 * margin);
      if ((x / width - 0.5) ** 2 + (y / height - 0.5) ** 2 < r ** 2) {
        return { x, y };
      }
    }
  };
  const worker = (iter: number) => {
    if (iter === nitems) {
      points.sort((a, b) => a.x - b.x);
      onComplete();
      return;
    }
    const point = initPoint();
    points.push(point);
    graph.addCircle(point);
    requestAnimationFrame(() => {
      worker(iter + 1);
    });
  };
  worker(0);
}

function triangulate(
  nitems: number,
  graph: Graph,
  points: Array<Point>,
  triangulator: Triangulator,
  onComplete: () => void,
) {
  const worker = (iter: number) => {
    if (iter === nitems) {
      onComplete();
      return;
    }
    triangulator.addPoint(points[iter]);
    drawTriangles(graph, triangulator.triangles);
    requestAnimationFrame(() => {
      worker(iter + 1);
    });
  };
  worker(0);
}

function main() {
  const nitems = getNitems();
  const graph = new Graph("graph");
  const points = new Array<Point>();
  const triangulator = new Triangulator();
  const button = new Button("proceed-button");
  button.textContent = "Start";
  button.onClick([
    (clickedButton: Button) => {
      clickedButton.disabled = true;
      clickedButton.textContent = "Setting points";
      const onComplete = () => {
        clickedButton.disabled = false;
        clickedButton.textContent = "Start triangulaion";
      };
      setUpPoints(nitems, graph, points, onComplete);
    },
    (clickedButton: Button) => {
      clickedButton.disabled = true;
      clickedButton.textContent = "Triangulation in progress";
      triangulator.setupAuxiliaryTriangle(points);
      const onComplete = () => {
        triangulator.removeAuxiliaryTriangle();
        drawTriangles(graph, triangulator.triangles);
        clickedButton.disabled = false;
        clickedButton.textContent = "Reset";
      };
      triangulate(nitems, graph, points, triangulator, onComplete);
    },
    (clickedButton: Button) => {
      clickedButton.disabled = true;
      graph.resetCircles();
      graph.resetPolygons();
      points.length = 0;
      triangulator.reset();
      clickedButton.disabled = false;
      button.textContent = "Start";
    },
  ]);
  window.addEventListener("resize", () => {
    graph.updateGraphSize();
  });
}

window.addEventListener("load", () => {
  main();
});
