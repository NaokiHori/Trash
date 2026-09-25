import { BrownTruss } from "./truss/brown";
import { HoweTruss } from "./truss/howe";
import { ParkerTruss } from "./truss/parker";
import { PrattTruss } from "./truss/pratt";
import { WarrenTruss } from "./truss/warren";
import { TrussEdge } from "./truss/trussEdge";
import { TrussNode } from "./truss/trussNode";
import { solve } from "./finiteElement";

export { TrussEdge } from "./truss/trussEdge";
export { TrussNode } from "./truss/trussNode";

export interface TrussProperties {
  getNodes(): Readonly<Array<TrussNode>>;
  getEdges(): Readonly<Array<TrussEdge>>;
  getLabel(): string;
}

export class Truss {
  private truss: TrussProperties;
  private trusses: Array<() => TrussProperties>;
  private current: number;

  public constructor() {
    this.trusses = [
      (): TrussProperties => new BrownTruss(),
      (): TrussProperties => new HoweTruss(),
      (): TrussProperties => new ParkerTruss(),
      (): TrussProperties => new PrattTruss(),
      (): TrussProperties => new WarrenTruss(),
    ];
    this.current = Math.floor(Math.random() * this.trusses.length);
    this.truss = this.trusses[this.current]();
  }

  public toPrev(): void {
    this.current = (this.current + this.trusses.length - 1) % this.trusses.length;
    this.truss = this.trusses[this.current]();
  }

  public toNext(): void {
    this.current = (this.current + this.trusses.length + 1) % this.trusses.length;
    this.truss = this.trusses[this.current]();
  }

  public solve(): void {
    solve(this.getNodes(), this.getEdges());
  }

  public getLabel(): string {
    return this.truss.getLabel();
  }

  public getNodes(): Readonly<Array<TrussNode>> {
    return this.truss.getNodes();
  }

  public getEdges(): Readonly<Array<TrussEdge>> {
    return this.truss.getEdges();
  }
}
