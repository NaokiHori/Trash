import { Canvas } from "./canvas";
import { WebGL } from "./webgl";
import { DomainSize } from "./domainSize";
import { Timer } from "./timer";

function animate(webGL: WebGL, timer: Timer) {
  webGL.incrementCounter();
  webGL.draw();
  timer.update();
  requestAnimationFrame(() => {
    animate(webGL, timer);
  });
}

function main({ enableImageSaver }: { enableImageSaver: boolean }) {
  const canvas = new Canvas({ elementId: "canvas" });
  const gl: WebGLRenderingContext = canvas.getWebGLRenderingContext();
  const domainSize = new DomainSize();
  const center: [number, number] = [0, 0];
  const webGL = new WebGL(gl);
  webGL.domainSize = domainSize.get();
  webGL.orbitType = [1, 2, 3].sort(() => Math.random() - 0.5)[0];
  webGL.center = center;
  webGL.orbitTrapCenter = [
    Math.E * (Math.random() - 0.5),
    Math.E * (Math.random() - 0.5),
  ];
  webGL.recurrenceOffset = [
    Math.E * (Math.random() - 0.5),
    Math.E * (Math.random() - 0.5),
  ];
  window.addEventListener("resize", () => {
    canvas.adjustSize();
    webGL.updateResolution(canvas.width, canvas.height);
    webGL.draw();
  });
  window.addEventListener("wheel", (event: WheelEvent) => {
    domainSize.update(event.deltaY * 0.05);
    webGL.domainSize = domainSize.get();
    webGL.draw();
  });
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key: string = event.key;
    if ("+" === key) {
      domainSize.update(-0.05);
      webGL.domainSize = domainSize.get();
      webGL.draw();
    } else if ("-" === key) {
      domainSize.update(0.05);
      webGL.domainSize = domainSize.get();
      webGL.draw();
    } else if ("ArrowLeft" === key) {
      center[0] -= 0.1 * domainSize.get();
      webGL.center = center;
      webGL.draw();
    } else if ("ArrowRight" === key) {
      center[0] += 0.1 * domainSize.get();
      webGL.center = center;
      webGL.draw();
    } else if ("ArrowDown" === key) {
      center[1] -= 0.1 * domainSize.get();
      webGL.center = center;
      webGL.draw();
    } else if ("ArrowUp" === key) {
      center[1] += 0.1 * domainSize.get();
      webGL.center = center;
      webGL.draw();
    } else if ("r" === key) {
      domainSize.reset();
      center[0] = 0;
      center[1] = 0;
      webGL.domainSize = domainSize.get();
      webGL.center = center;
      webGL.draw();
    } else if ("s" === key && enableImageSaver) {
      canvas.saveImage("image.jpeg");
    }
  });
  canvas.adjustSize();
  webGL.updateResolution(canvas.width, canvas.height);
  webGL.draw();
  webGL.incrementCounter();
  const timer = new Timer(1000, () => {
    /* nothing to do for now */
  });
  timer.start();
  animate(webGL, timer);
}

window.addEventListener("load", () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  main({ enableImageSaver: urlSearchParams.has("enableImageSaver") });
});
