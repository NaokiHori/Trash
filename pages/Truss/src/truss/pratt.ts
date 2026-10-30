import { TrussProperties, TrussEdge } from "../truss";
import { TrussNode } from "./trussNode";
import { Config } from "./helper";

export class PrattTruss implements TrussProperties {
  private label: string = "Pratt Truss";
  private nodes: Readonly<Array<TrussNode>>;
  private edges: Readonly<Array<TrussEdge>>;

  public constructor() {
    const n = 8;
    const configList = new Array<Config>();
    for (let i = 0; i < 2 * n; i += 1) {
      configList.push({
        isFixed: 0 === i || n === i,
        x: i < n + 1 ? -1 + (2 / n) * i : -1 + (2 / n) * (i - n),
        y: i < n + 1 ? 0 : 2 / n,
      });
    }
    const nodes = new Array<TrussNode>();
    for (const [index, config] of configList.entries()) {
      nodes.push(new TrussNode(index, config.isFixed, config.x, config.y));
    }
    const edges = new Array<TrussEdge>();
    // bottom
    for (let i = 0; i < n; i += 1) {
      edges.push(new TrussEdge([nodes[i], nodes[i + 1]]));
    }
    // top
    for (let i = n + 1; i < 2 * n - 1; i += 1) {
      edges.push(new TrussEdge([nodes[i], nodes[i + 1]]));
    }
    // vertical
    for (let i = 1; i < n; i += 1) {
      edges.push(new TrussEdge([nodes[i], nodes[i + n]]));
    }
    // diagonal
    edges.push(
      new TrussEdge([nodes[0], nodes[n + 1]]),
      new TrussEdge([nodes[n], nodes[2 * n - 1]]),
    );
    for (let i = 1; i < n / 2; i += 1) {
      edges.push(
        new TrussEdge([nodes[i + 1], nodes[i + n]]),
        new TrussEdge([nodes[n - i - 1], nodes[2 * n - i]]),
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
