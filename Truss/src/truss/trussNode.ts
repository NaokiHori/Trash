import { Circle } from "../svg";

export class TrussNode {
  private index: number;
  private isPinned: boolean;
  private x: number;
  private y: number;
  private dx: number;
  private dy: number;
  private circle: Circle;

  public constructor(index: number, isPinned: boolean, x: number, y: number) {
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

  public getIndex(): number {
    return this.index;
  }

  public getIsPinned(): boolean {
    return this.isPinned;
  }

  public getCircle(): Circle {
    return this.circle;
  }

  public update(): void {
    this.circle.updatePosition(this.x + this.dx, this.y + this.dy);
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getDx(): number {
    return this.dx;
  }

  public getDy(): number {
    return this.dy;
  }

  public setDx(dx: number): void {
    this.dx = dx;
  }

  public setDy(dy: number): void {
    this.dy = dy;
  }
}
