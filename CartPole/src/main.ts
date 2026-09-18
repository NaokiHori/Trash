import { Animation } from "./animation";
import { Camera } from "./camera";
import { Controller, fromPoles } from "./controller";
import { GRAVITATIONAL_ACCELERATION } from "./parameter";
import { Cart, Pendulum, integrate, checkStabilityCriteria } from "./simulator";
import { Line } from "./svg";

class Link {
  svg: Line;

  constructor(cart: Cart, pendulum: Pendulum) {
    const x1 = cart.getX();
    const y1 = cart.getY();
    const x2 = pendulum.getX();
    const y2 = pendulum.getY();
    this.svg = new Line(["link"], x1, y1, x2, y2);
  }

  draw(cart: Cart, pendulum: Pendulum) {
    const x1 = cart.getX();
    const y1 = cart.getY();
    const x2 = cart.getX() + pendulum.getX();
    const y2 = cart.getY() + pendulum.getY();
    this.svg.updatePosition(x1, y1, x2, y2);
  }
}

function getElementByIdOrThrow(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (null === element) {
    throw new Error();
  }
  return element;
}

function main() {
  const cart = new Cart(0, 0);
  const pendulum = new Pendulum(0.3 * Math.PI, 0);
  const link = new Link(cart, pendulum);
  const graph = getElementByIdOrThrow("graph");
  graph.appendChild(cart.svg.getElement());
  graph.appendChild(pendulum.svg.getElement());
  graph.appendChild(link.svg.getElement());
  const pidParameters = fromPoles(cart, pendulum);
  const pendulumController = new Controller(
    pidParameters.pendulum,
    (): number => {
      function fmod(a: number, b: number) {
        return a - b * Math.trunc(a / b);
      }
      let error = 0.5 * Math.PI - pendulum.position;
      // keep error in [- pi : pi]
      error = fmod(error + Math.PI, 2 * Math.PI);
      if (error < 0) {
        error += 2 * Math.PI;
      }
      error -= Math.PI;
      return error;
    },
    (): number => -pendulum.velocity,
  );
  const cartController = new Controller(
    pidParameters.cart,
    (): number => -cart.position,
    (): number => -cart.velocity,
  );
  if (
    !checkStabilityCriteria(
      pendulum,
      cart,
      pendulumController.pidParameters,
      cartController.pidParameters,
    )
  ) {
    console.warn("unstable system");
  }
  const camera = new Camera(graph);
  let isControlled = true;
  let isSwingMode = false;
  graph.addEventListener("click", () => {
    isControlled = !isControlled;
    graph.setAttribute("is-controlled", isControlled.toString());
  });
  graph.setAttribute("is-controlled", isControlled.toString());
  const animation = new Animation(60, () => {
    const dt = 1e-4;
    const visualizeRate = 1e-2;
    for (let time = 0; time < visualizeRate; time += dt) {
      if (0.9 < Math.sin(pendulum.position)) {
        isSwingMode = false;
      }
      if (Math.sin(pendulum.position) < 0.8) {
        isSwingMode = true;
      }
      const externalForce = (function () {
        if (!isControlled) {
          return 0;
        } else if (isSwingMode) {
          return (
            50 *
              Math.sin(pendulum.position) *
              pendulum.velocity *
              (-pendulum.mass *
                GRAVITATIONAL_ACCELERATION *
                pendulum.length *
                (1 - Math.sin(pendulum.position)) -
                0.5 *
                  pendulum.mass *
                  Math.pow(pendulum.length, 2) *
                  Math.pow(pendulum.velocity, 2)) -
            10 * cart.position -
            10 * cart.velocity
          );
        } else {
          return (
            pendulumController.computeExternalForce(dt) + cartController.computeExternalForce(dt)
          );
        }
      })();
      integrate(dt, externalForce, pendulum, cart);
    }
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
