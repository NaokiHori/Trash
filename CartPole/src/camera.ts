export class Camera {
  private x: number = 0;
  private size: number = 0.25;
  private svg: SVGSVGElement;

  public constructor(svg: SVGSVGElement) {
    this.svg = svg;
  }

  public update(targetX: number): void {
    this.x += 0.1 * (targetX - this.x);
    const halfSize = this.size / 2;
    this.svg.setAttribute("viewBox", `${this.x - halfSize} ${-halfSize} ${this.size} ${this.size}`);
  }
}
