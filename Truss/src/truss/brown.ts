import { TrussProperties, TrussNode, TrussEdge } from "../truss";
import { Config } from "./helper";

export class BrownTruss implements TrussProperties {
  label: string = "Brown Truss";
  nodes: Readonly<Array<TrussNode>>;
  edges: Readonly<Array<TrussEdge>>;

  constructor() {
    const n = 8;
    const configList = new Array<Config>();
    for (let i = 0; i < 2 * n + 2; i++) {
      configList.push({
        isFixed: 0 == i || 2 * n == i,
        x: -1 + (2 / n) * Math.trunc(i / 2),
        y: 0 == i % 2 ? 0 : 2 / n,
      });
    }
    const nodes = new Array<TrussNode>();
    for (const [index, config] of configList.entries()) {
      nodes.push(new TrussNode(index, config.isFixed, config.x, config.y));
    }
    const edges = new Array<TrussEdge>();
    // vertical
    for (let i = 0; i < n + 1; i++) {
      edges.push(new TrussEdge([nodes[2 * i], nodes[2 * i + 1]]));
    }
    // horizontal
    for (let i = 0; i < 2 * n; i++) {
      edges.push(new TrussEdge([nodes[i], nodes[i + 2]]));
    }
    // diagonal
    for (let i = 0; i < n; i++) {
      edges.push(new TrussEdge([nodes[2 * i], nodes[2 * i + 3]]));
      edges.push(new TrussEdge([nodes[2 * i + 1], nodes[2 * i + 2]]));
    }
    this.nodes = nodes;
    this.edges = edges;
  }
}
