import { PidParameters } from "./controller";
import { GRAVITATIONAL_ACCELERATION } from "./parameter";
import { Circle, Rect } from "./svg";

interface Object {
  position: number;
  velocity: number;
}

export class Pendulum implements Object {
  mass: number = 1e-1;
  length: number = 1e-1;
  dissipation: number = 1e-4;
  position: number;
  velocity: number;
  svg: Circle;
  errorSum: number;

  constructor(position: number, velocity: number) {
    this.position = position;
    this.velocity = velocity;
    this.svg = new Circle(["pendulum-mass"], this.getX(), this.getY());
    this.errorSum = 0;
  }

  getX(): number {
    return this.length * Math.cos(this.position);
  }

  getY(): number {
    return this.length * Math.sin(this.position);
  }

  draw(cart: Readonly<Cart>) {
    this.svg.updatePosition(cart.getX() + this.getX(), cart.getY() + this.getY());
  }
}

export class Cart implements Object {
  mass: number = 5e-1;
  dissipation: number = 1e-4;
  position: number;
  velocity: number;
  svg: Rect;
  errorSum: number;

  constructor(position: number, velocity: number) {
    this.position = position;
    this.velocity = velocity;
    this.svg = new Rect(["cart"], this.getX(), this.getY());
    this.errorSum = 0;
  }

  getX(): number {
    return this.position;
  }

  getY(): number {
    return 0;
  }

  draw() {
    this.svg.updatePosition(this.getX(), this.getY());
  }
}

export function integrate(dt: number, externalForce: number, pendulum: Pendulum, cart: Cart) {
  const rhsTerms = [
    pendulum.mass * pendulum.length * Math.pow(pendulum.velocity, 2) * Math.cos(pendulum.position) +
      externalForce -
      cart.dissipation * cart.velocity,
    pendulum.mass * GRAVITATIONAL_ACCELERATION * pendulum.length * Math.cos(pendulum.position) -
      pendulum.dissipation * pendulum.velocity,
  ];
  const determinant =
    pendulum.mass *
    Math.pow(pendulum.length, 2) *
    (cart.mass + pendulum.mass * Math.pow(Math.cos(pendulum.position), 2));
  cart.velocity +=
    (dt / determinant) *
    (pendulum.mass * Math.pow(pendulum.length, 2) * rhsTerms[0] +
      pendulum.mass * pendulum.length * Math.sin(pendulum.position) * rhsTerms[1]);
  pendulum.velocity +=
    (dt / determinant) *
    (pendulum.mass * pendulum.length * Math.sin(pendulum.position) * rhsTerms[0] +
      (cart.mass + pendulum.mass) * rhsTerms[1]);
  cart.position += cart.velocity * dt;
  pendulum.position += pendulum.velocity * dt;
}

export function checkStabilityCriteria(
  pendulum: Pendulum,
  cart: Cart,
  pendulumParameters: PidParameters,
  cartParameters: PidParameters,
): boolean {
  let isStable = true;
  const coefficients = [
    cartParameters.p * GRAVITATIONAL_ACCELERATION,
    cartParameters.d * GRAVITATIONAL_ACCELERATION,
    cart.mass * GRAVITATIONAL_ACCELERATION +
      pendulum.mass * GRAVITATIONAL_ACCELERATION +
      pendulum.length * cartParameters.p +
      pendulumParameters.p,
    pendulum.length * cartParameters.d + pendulumParameters.d,
    cart.mass * pendulum.length,
  ];
  for (const [index, coefficient] of coefficients.entries()) {
    if (coefficient <= 0) {
      console.warn(
        `non-positive polynomial coefficient at ${index.toString()}: ${coefficient.toString()}`,
      );
      isStable = false;
    } else {
      console.log(
        `positive polynomial coefficient at ${index.toString()}: ${coefficient.toString()}`,
      );
    }
  }
  const crossTerms = [
    coefficients[3] * coefficients[2] - coefficients[4] * coefficients[1],
    coefficients[3] * coefficients[2] * coefficients[1] -
      coefficients[4] * coefficients[1] * coefficients[1] -
      coefficients[3] * coefficients[3] * coefficients[0],
  ];
  for (const [index, crossTerm] of crossTerms.entries()) {
    if (crossTerm <= 0) {
      console.warn(`non-positive cross term at ${index.toString()}: ${crossTerm.toString()}`);
      isStable = false;
    } else {
      console.log(`positive cross term at ${index.toString()}: ${crossTerm.toString()}`);
    }
  }
  return isStable;
}
