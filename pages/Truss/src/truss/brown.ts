import { TrussProperties, TrussEdge } from "../truss";
import { TrussNode } from "./trussNode";
import { Config } from "./helper";

export class BrownTruss implements TrussProperties {
  private label: string = "Brown Truss";
  private nodes: Readonly<Array<TrussNode>>;
  private edges: Readonly<Array<TrussEdge>>;

  public constructor() {
    const n = 8;
    const configList = new Array<Config>();
    for (let i = 0; i < 2 * n + 2; i += 1) {
      configList.push({
        isFixed: 0 === i || 2 * n === i,
        x: -1 + (2 / n) * Math.trunc(i / 2),
        y: 0 === i % 2 ? 0 : 2 / n,
      });
    }
    const nodes = new Array<TrussNode>();
    for (const [index, config] of configList.entries()) {
      nodes.push(new TrussNode(index, config.isFixed, config.x, config.y));
    }
    const edges = new Array<TrussEdge>();
    // vertical
    for (let i = 0; i < n + 1; i += 1) {
      edges.push(new TrussEdge([nodes[2 * i], nodes[2 * i + 1]]));
    }
    // horizontal
    for (let i = 0; i < 2 * n; i += 1) {
      edges.push(new TrussEdge([nodes[i], nodes[i + 2]]));
    }
    // diagonal
    for (let i = 0; i < n; i += 1) {
      edges.push(
        new TrussEdge([nodes[2 * i], nodes[2 * i + 3]]),
        new TrussEdge([nodes[2 * i + 1], nodes[2 * i + 2]]),
      );
    }
    this.nodes = nodes;
    this.edges = edges;
  }

  public getLabel(): string {
    return this.label;
  }

  public getNodes(): Readonly<Array<TrussNode>> {
    return this.nodes;
  }

  public getEdges(): Readonly<Array<TrussEdge>> {
    return this.edges;
  }
}
