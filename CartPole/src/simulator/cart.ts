import { Rect } from "../svg";
import { Object } from "./object";

export class Cart implements Object {
  private mass: number = 5e-1;
  private dissipation: number = 1e-4;
  private position: number;
  private velocity: number;
  private svg: Rect;

  public constructor(position: number, velocity: number) {
    this.position = position;
    this.velocity = velocity;
    this.svg = new Rect(["cart"], this.getX(), this.getY());
  }

  public getX(): number {
    return this.position;
  }

  // oxlint-disable eslint/class-methods-use-this (for notational consistency)
  public getY(): number {
    return 0;
  }

  public draw(): void {
    this.svg.updatePosition(this.getX(), this.getY());
  }

  public getMass(): number {
    return this.mass;
  }

  public getDissipation(): number {
    return this.dissipation;
  }

  public getPosition(): number {
    return this.position;
  }

  public setPosition(position: number): void {
    this.position = position;
  }

  public getVelocity(): number {
    return this.velocity;
  }

  public setVelocity(velocity: number): void {
    this.velocity = velocity;
  }

  public getSvg(): Rect {
    return this.svg;
  }
}
