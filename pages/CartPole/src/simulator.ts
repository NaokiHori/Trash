import { PidParameters } from "./controller";
import { GRAVITATIONAL_ACCELERATION } from "./parameter";
import { Cart } from "./simulator/cart";
import { Pendulum } from "./simulator/pendulum";

export { PidParameters } from "./controller";
export { Cart } from "./simulator/cart";
export { Pendulum } from "./simulator/pendulum";

export function integrate(dt: number, externalForce: number, pendulum: Pendulum, cart: Cart): void {
  const rhsTerms = [
    pendulum.getMass() *
      pendulum.getLength() *
      Math.pow(pendulum.getVelocity(), 2) *
      Math.cos(pendulum.getPosition()) +
      externalForce -
      cart.getDissipation() * cart.getVelocity(),
    pendulum.getMass() *
      GRAVITATIONAL_ACCELERATION *
      pendulum.getLength() *
      Math.cos(pendulum.getPosition()) -
      pendulum.getDissipation() * pendulum.getVelocity(),
  ];
  const determinant =
    pendulum.getMass() *
    Math.pow(pendulum.getLength(), 2) *
    (cart.getMass() + pendulum.getMass() * Math.pow(Math.cos(pendulum.getPosition()), 2));
  cart.setVelocity(
    cart.getVelocity() +
      (dt / determinant) *
        (pendulum.getMass() * Math.pow(pendulum.getLength(), 2) * rhsTerms[0] +
          pendulum.getMass() *
            pendulum.getLength() *
            Math.sin(pendulum.getPosition()) *
            rhsTerms[1]),
  );
  pendulum.setVelocity(
    pendulum.getVelocity() +
      (dt / determinant) *
        (pendulum.getMass() *
          pendulum.getLength() *
          Math.sin(pendulum.getPosition()) *
          rhsTerms[0] +
          (cart.getMass() + pendulum.getMass()) * rhsTerms[1]),
  );
  cart.setPosition(cart.getPosition() + cart.getVelocity() * dt);
  pendulum.setPosition(pendulum.getPosition() + pendulum.getVelocity() * dt);
}

export function checkStabilityCriteria(
  pendulum: Pendulum,
  cart: Cart,
  pendulumParameters: PidParameters,
  cartParameters: PidParameters,
): { isStable: boolean; reasons: Readonly<Array<string>> } {
  let isStable = true;
  let reasons = new Array<string>();
  const coefficients = [
    cartParameters.getP() * GRAVITATIONAL_ACCELERATION,
    cartParameters.getD() * GRAVITATIONAL_ACCELERATION,
    cart.getMass() * GRAVITATIONAL_ACCELERATION +
      pendulum.getMass() * GRAVITATIONAL_ACCELERATION +
      pendulum.getLength() * cartParameters.getP() +
      pendulumParameters.getP(),
    pendulum.getLength() * cartParameters.getD() + pendulumParameters.getD(),
    cart.getMass() * pendulum.getLength(),
  ];
  for (const [index, coefficient] of coefficients.entries()) {
    if (coefficient <= 0) {
      isStable = false;
      reasons.push(
        `non-positive polynomial coefficient at ${index.toString()}: ${coefficient.toString()}`,
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
      isStable = false;
      reasons.push(`non-positive cross term at ${index.toString()}: ${crossTerm.toString()}`);
    }
  }
  return { isStable, reasons };
}
