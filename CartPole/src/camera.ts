export class Camera {
  private x: number = 0;
  private size: number = 0.25;
  private svg: HTMLElement;

  constructor(svg: HTMLElement) {
    this.svg = svg;
  }

  update(targetX: number) {
    this.x += 0.1 * (targetX - this.x);
    this.svg.setAttribute(
      "viewBox",
      `${this.x - this.size / 2} ${-this.size / 2} ${this.size} ${this.size}`,
    );
  }
}
