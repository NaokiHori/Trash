import { Circle } from "../svg";
import { Object } from "./object";
import { Cart } from "./cart";

export class Pendulum implements Object {
  private mass: number = 1e-1;
  private length: number = 1e-1;
  private dissipation: number = 1e-4;
  private position: number;
  private velocity: number;
  private svg: Circle;

  public constructor(position: number, velocity: number) {
    this.position = position;
    this.velocity = velocity;
    this.svg = new Circle(["pendulum-mass"], this.getX(), this.getY());
  }

  public getX(): number {
    return this.length * Math.cos(this.position);
  }

  public getY(): number {
    return this.length * Math.sin(this.position);
  }

  public draw(cart: Readonly<Cart>): void {
    this.svg.updatePosition(cart.getX() + this.getX(), cart.getY() + this.getY());
  }

  public getMass(): number {
    return this.mass;
  }

  public getLength(): number {
    return this.length;
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

  public getSvg(): Circle {
    return this.svg;
  }
}
