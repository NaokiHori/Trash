import { Truss } from "./truss";

function getElementByIdOrThrow<T extends Element>(
  type: new (...args: unknown[]) => T,
  id: string,
): T {
  const element = document.querySelector(`#${id}`);
  if (null === element) {
    throw new Error();
  }
  if (!(element instanceof type)) {
    throw new Error();
  }
  return element;
}

function setupSVG(truss: Readonly<Truss>): void {
  const nodesElement = getElementByIdOrThrow(SVGGElement, "truss-nodes");
  const edgesElement = getElementByIdOrThrow(SVGGElement, "truss-edges");
  const labelElement = getElementByIdOrThrow(HTMLDivElement, "truss-label");
  labelElement.textContent = truss.getLabel();
  nodesElement.replaceChildren();
  edgesElement.replaceChildren();
  for (const node of truss.getNodes()) {
    nodesElement.append(node.getCircle().getElement());
  }
  for (const edge of truss.getEdges()) {
    edgesElement.append(edge.getLine().getElement());
  }
}

function updateSVG(truss: Readonly<Truss>): void {
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

function main(): void {
  const truss = new Truss();
  getElementByIdOrThrow(HTMLButtonElement, "to-prev").addEventListener("click", () => {
    truss.toPrev();
    setupSVG(truss);
  });
  getElementByIdOrThrow(HTMLButtonElement, "to-next").addEventListener("click", () => {
    truss.toNext();
    setupSVG(truss);
  });
  getElementByIdOrThrow(HTMLButtonElement, "run").addEventListener("click", () => {
    truss.solve();
    updateSVG(truss);
  });
  setupSVG(truss);
}

window.addEventListener("load", () => {
  main();
});
