import { Animation } from "./animation";
import { Camera } from "./camera";
import { Controller, fromPoles } from "./controller";
import { GRAVITATIONAL_ACCELERATION } from "./parameter";
import { PidParameters, Cart, Pendulum, integrate, checkStabilityCriteria } from "./simulator";
import { Line } from "./svg";

class Link {
  private svg: Line;

  public constructor(cart: Cart, pendulum: Pendulum) {
    const x1 = cart.getX();
    const y1 = cart.getY();
    const x2 = pendulum.getX();
    const y2 = pendulum.getY();
    this.svg = new Line(["link"], x1, y1, x2, y2);
  }

  public draw(cart: Cart, pendulum: Pendulum): void {
    const x1 = cart.getX();
    const y1 = cart.getY();
    const x2 = cart.getX() + pendulum.getX();
    const y2 = cart.getY() + pendulum.getY();
    this.svg.updatePosition(x1, y1, x2, y2);
  }

  public getSvg(): Line {
    return this.svg;
  }
}

interface Flags {
  isSwingMode: boolean;
  isControlled: boolean;
}

function getGraphByIdOrThrow(id: string): SVGSVGElement {
  const element = document.querySelector(`#${id}`);
  if (null === element) {
    throw new Error();
  }
  if (!(element instanceof SVGSVGElement)) {
    throw new Error();
  }
  return element;
}

function fmod(a: number, b: number): number {
  return a - b * Math.trunc(a / b);
}

function setupPendulumController(pidParameters: PidParameters, pendulum: Pendulum): Controller {
  return new Controller(
    pidParameters,
    (): number => {
      let error = 0.5 * Math.PI - pendulum.getPosition();
      // keep error in [- pi : pi]
      error = fmod(error + Math.PI, 2 * Math.PI);
      if (error < 0) {
        error += 2 * Math.PI;
      }
      error -= Math.PI;
      return error;
    },
    (): number => -pendulum.getVelocity(),
  );
}

function setupCartController(pidParameters: PidParameters, cart: Cart): Controller {
  return new Controller(
    pidParameters,
    (): number => -cart.getPosition(),
    (): number => -cart.getVelocity(),
  );
}

function updateSystem(
  visualizeRate: number,
  pendulum: Pendulum,
  cart: Cart,
  pendulumController: Controller,
  cartController: Controller,
  flags: Flags,
): void {
  const dt = 1e-4;
  for (let time = 0; time < visualizeRate; time += dt) {
    if (0.9 < Math.sin(pendulum.getPosition())) {
      flags.isSwingMode = false;
    }
    if (Math.sin(pendulum.getPosition()) < 0.8) {
      flags.isSwingMode = true;
    }
    const externalForce = (function (): number {
      if (!flags.isControlled) {
        return 0;
      } else if (flags.isSwingMode) {
        return (
          50 *
            Math.sin(pendulum.getPosition()) *
            pendulum.getVelocity() *
            (-pendulum.getMass() *
              GRAVITATIONAL_ACCELERATION *
              pendulum.getLength() *
              (1 - Math.sin(pendulum.getPosition())) -
              0.5 *
                pendulum.getMass() *
                Math.pow(pendulum.getLength(), 2) *
                Math.pow(pendulum.getVelocity(), 2)) -
          10 * cart.getPosition() -
          10 * cart.getVelocity()
        );
      }
      return pendulumController.computeExternalForce(dt) + cartController.computeExternalForce(dt);
    })();
    integrate(dt, externalForce, pendulum, cart);
  }
}

function main(): void {
  const cart = new Cart(0, 0);
  const pendulum = new Pendulum(0.3 * Math.PI, 0);
  const link = new Link(cart, pendulum);
  const graph = getGraphByIdOrThrow("graph");
  graph.append(cart.getSvg().getElement());
  graph.append(pendulum.getSvg().getElement());
  graph.append(link.getSvg().getElement());
  const pidParameters = fromPoles(cart, pendulum);
  const pendulumController = setupPendulumController(pidParameters.pendulum, pendulum);
  const cartController = setupCartController(pidParameters.cart, cart);
  const { isStable, reasons } = checkStabilityCriteria(
    pendulum,
    cart,
    pendulumController.getPidParameters(),
    cartController.getPidParameters(),
  );
  if (!isStable) {
    throw new Error(`unstable system: ${reasons.join(",")}`);
  }
  const camera = new Camera(graph);
  const flags = {
    isControlled: true,
    isSwingMode: false,
  };
  graph.addEventListener("click", () => {
    flags.isControlled = !flags.isControlled;
    graph.setAttribute("is-controlled", flags.isControlled.toString());
  });
  graph.setAttribute("is-controlled", flags.isControlled.toString());
  const animation = new Animation(60, () => {
    const visualizeRate = 1e-2;
    updateSystem(visualizeRate, pendulum, cart, pendulumController, cartController, flags);
    link.draw(cart, pendulum);
    cart.draw();
    pendulum.draw(cart);
    camera.update(cart.getX());
  });
  animation.start();
}

window.addEventListener("load", () => {
  main();
});
