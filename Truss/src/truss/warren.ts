import { TrussProperties, TrussNode, TrussEdge } from "../truss";
import { Config } from "./helper";

export class WarrenTruss implements TrussProperties {
  label: string = "Warren Truss";
  nodes: Readonly<Array<TrussNode>>;
  edges: Readonly<Array<TrussEdge>>;

  constructor() {
    const n = 8;
    const configList = new Array<Config>();
    for (let i = 0; i < 2 * n + 1; i++) {
      configList.push({
        isFixed: 0 == i || 2 * n == i,
        x: -1 + (2 / (2 * n)) * i,
        y: 0 == i % 2 ? 0 : (1 / n) * Math.sqrt(3),
      });
    }
    const nodes = new Array<TrussNode>();
    for (const [index, config] of configList.entries()) {
      nodes.push(new TrussNode(index, config.isFixed, config.x, config.y));
    }
    const edges = new Array<TrussEdge>();
    // bottom
    for (let i = 0; i < n; i++) {
      edges.push(new TrussEdge([nodes[2 * i], nodes[2 * (i + 1)]]));
    }
    // top
    for (let i = 0; i < n - 1; i++) {
      edges.push(new TrussEdge([nodes[2 * i + 1], nodes[2 * (i + 1) + 1]]));
    }
    // diagonal
    for (let i = 0; i < 2 * n; i++) {
      edges.push(new TrussEdge([nodes[i], nodes[i + 1]]));
    }
    this.nodes = nodes;
    this.edges = edges;
  }
}
