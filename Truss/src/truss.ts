import { Circle, Line } from "./svg";
import { BrownTruss } from "./truss/brown";
import { HoweTruss } from "./truss/howe";
import { ParkerTruss } from "./truss/parker";
import { PrattTruss } from "./truss/pratt";
import { WarrenTruss } from "./truss/warren";
import { solve } from "./finiteElement";

export class TrussNode {
  index: number;
  isPinned: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  circle: Circle;

  constructor(index: number, isPinned: boolean, x: number, y: number) {
    this.index = index;
    this.isPinned = isPinned;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    const classNames = ["truss-node"];
    if (isPinned) {
      classNames.push("focused");
    }
    this.circle = new Circle(classNames, x, y);
  }

  getCircle(): Circle {
    return this.circle;
  }

  update() {
    this.circle.updatePosition(this.x + this.dx, this.y + this.dy);
  }
}

export class TrussEdge {
  nodes: [TrussNode, TrussNode];
  line: Line;

  constructor(nodes: [TrussNode, TrussNode]) {
    this.nodes = nodes;
    const classNames = ["truss-edge"];
    this.line = new Line(classNames, nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y);
  }

  getLine(): Line {
    return this.line;
  }

  getLength(): number {
    const nodes = this.nodes;
    const vector = [nodes[1].x - nodes[0].x, nodes[1].y - nodes[0].y];
    return Math.hypot(vector[0], vector[1]);
  }

  private getLengthWithDisplacement(): number {
    const nodes = this.nodes;
    const vector = [
      nodes[1].x + nodes[1].dx - nodes[0].x - nodes[0].dx,
      nodes[1].y + nodes[1].dy - nodes[0].y - nodes[0].dy,
    ];
    return Math.hypot(vector[0], vector[1]);
  }

  getStrain(): number {
    const originalLength = this.getLength();
    const deformedLength = this.getLengthWithDisplacement();
    return (deformedLength - originalLength) / originalLength;
  }

  update(referenceStrain: number) {
    const line = this.line;
    const nodes = this.nodes;
    const strain = this.getStrain();
    if (0 < strain) {
      const saturation = (100 * Math.abs(strain)) / referenceStrain;
      line.setColor(`hsl(0deg ${saturation}% 80%)`);
    } else if (strain < 0) {
      const saturation = (100 * Math.abs(strain)) / referenceStrain;
      line.setColor(`hsl(180deg ${saturation}% 80%)`);
    }
    line.updatePosition(
      nodes[0].x + nodes[0].dx,
      nodes[0].y + nodes[0].dy,
      nodes[1].x + nodes[1].dx,
      nodes[1].y + nodes[1].dy,
    );
  }
}

export interface TrussProperties {
  label: string;
  nodes: Readonly<Array<TrussNode>>;
  edges: Readonly<Array<TrussEdge>>;
}

export class Truss {
  truss: TrussProperties;
  trusses: Array<() => TrussProperties>;
  private current: number;

  constructor() {
    this.current = 0;
    this.trusses = [
      () => new BrownTruss(),
      () => new HoweTruss(),
      () => new ParkerTruss(),
      () => new PrattTruss(),
      () => new WarrenTruss(),
    ];
    this.truss = this.trusses[this.current]();
  }

  toPrev() {
    this.current = (this.current + this.trusses.length - 1) % this.trusses.length;
    this.truss = this.trusses[this.current]();
  }

  toNext() {
    this.current = (this.current + this.trusses.length + 1) % this.trusses.length;
    this.truss = this.trusses[this.current]();
  }

  solve() {
    solve(this.getNodes(), this.getEdges());
  }

  getLabel(): string {
    return this.truss.label;
  }

  getNodes(): Readonly<Array<TrussNode>> {
    return this.truss.nodes;
  }

  getEdges(): Readonly<Array<TrussEdge>> {
    return this.truss.edges;
  }
}
