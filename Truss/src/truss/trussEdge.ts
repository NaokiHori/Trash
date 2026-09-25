import { Line } from "../svg";
import { TrussNode } from "./trussNode";

export class TrussEdge {
  private nodes: Readonly<[Readonly<TrussNode>, Readonly<TrussNode>]>;
  private line: Line;

  public constructor(nodes: Readonly<[Readonly<TrussNode>, Readonly<TrussNode>]>) {
    this.nodes = nodes;
    const classNames = ["truss-edge"];
    this.line = new Line(
      classNames,
      nodes[0].getX(),
      nodes[0].getY(),
      nodes[1].getX(),
      nodes[1].getY(),
    );
  }

  public getNodes(): Readonly<[Readonly<TrussNode>, Readonly<TrussNode>]> {
    return this.nodes;
  }

  public getLine(): Line {
    return this.line;
  }

  public getLength(): number {
    const nodes = this.nodes;
    const vector = [nodes[1].getX() - nodes[0].getX(), nodes[1].getY() - nodes[0].getY()];
    return Math.hypot(vector[0], vector[1]);
  }

  private getLengthWithDisplacement(): number {
    const nodes = this.nodes;
    const vector = [
      nodes[1].getX() + nodes[1].getDx() - nodes[0].getX() - nodes[0].getDx(),
      nodes[1].getY() + nodes[1].getDy() - nodes[0].getY() - nodes[0].getDy(),
    ];
    return Math.hypot(vector[0], vector[1]);
  }

  public getStrain(): number {
    const originalLength = this.getLength();
    const deformedLength = this.getLengthWithDisplacement();
    return (deformedLength - originalLength) / originalLength;
  }

  public update(referenceStrain: number): void {
    const line = this.line;
    const nodes = this.nodes;
    const strain = this.getStrain();
    line.setColor(TrussEdge.strainToColor(referenceStrain, strain));
    line.updatePosition(
      nodes[0].getX() + nodes[0].getDx(),
      nodes[0].getY() + nodes[0].getDy(),
      nodes[1].getX() + nodes[1].getDx(),
      nodes[1].getY() + nodes[1].getDy(),
    );
  }

  private static strainToColor(referenceStrain: number, strain: number): string {
    if (strain === 0) {
      return "hsl(0deg 0% 75%)";
    }
    const magnitude = Math.min(Math.abs(strain) / referenceStrain, 1);
    const saturation = 40 + 60 * magnitude;
    const lightness = 75 - 35 * magnitude;
    const hue = strain > 0 ? 30 : 220;
    return `hsl(${hue}deg ${saturation}% ${lightness}%)`;
  }
}
