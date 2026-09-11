import { Truss } from "./truss";

const nodesElement = getElementByIdOrThrow("truss-nodes");
const edgesElement = getElementByIdOrThrow("truss-edges");
const labelElement = getElementByIdOrThrow("truss-label");

function getElementByIdOrThrow(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (null === element) {
    throw new Error();
  }
  return element;
}

function setupSVG(truss: Truss) {
  labelElement.textContent = truss.getLabel();
  nodesElement.replaceChildren();
  edgesElement.replaceChildren();
  for (const node of truss.getNodes()) {
    nodesElement.appendChild(node.getCircle().getElement());
  }
  for (const edge of truss.getEdges()) {
    edgesElement.appendChild(edge.getLine().getElement());
  }
}

function updateSVG(truss: Truss) {
  for (const node of truss.getNodes()) {
    node.update();
  }
  const strains = truss.getEdges().map((edge) => edge.getStrain());
  const minStrain = Math.min(...strains);
  const maxStrain = Math.max(...strains);
  const referenceStrain = Math.max(Math.abs(minStrain), Math.abs(maxStrain));
  for (const edge of truss.getEdges()) {
    edge.update(referenceStrain);
  }
}

function main() {
  const truss = new Truss();
  getElementByIdOrThrow("to-prev").addEventListener("click", () => {
    truss.toPrev();
    setupSVG(truss);
  });
  getElementByIdOrThrow("to-next").addEventListener("click", () => {
    truss.toNext();
    setupSVG(truss);
  });
  getElementByIdOrThrow("run").addEventListener("click", () => {
    truss.solve();
    updateSVG(truss);
  });
  setupSVG(truss);
}

window.addEventListener("load", () => {
  main();
});
