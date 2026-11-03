import { Animation } from "../../common/animation";
import { Canvas } from "./canvas";
import { WebGL } from "./webgl";
import { DomainSize } from "./domainSize";

function registerKeydownEvent(
  enableImageSaver: boolean,
  canvas: Canvas,
  domainSize: DomainSize,
  center: [number, number],
  webGL: WebGL,
): void {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key: string = event.key;
    if ("+" === key) {
      domainSize.update(-0.05);
      webGL.setDomainSize(domainSize.get());
      webGL.draw();
    } else if ("-" === key) {
      domainSize.update(0.05);
      webGL.setDomainSize(domainSize.get());
      webGL.draw();
    } else if ("ArrowLeft" === key) {
      center[0] -= 0.1 * domainSize.get();
      webGL.setCenter(center);
      webGL.draw();
    } else if ("ArrowRight" === key) {
      center[0] += 0.1 * domainSize.get();
      webGL.setCenter(center);
      webGL.draw();
    } else if ("ArrowDown" === key) {
      center[1] -= 0.1 * domainSize.get();
      webGL.setCenter(center);
      webGL.draw();
    } else if ("ArrowUp" === key) {
      center[1] += 0.1 * domainSize.get();
      webGL.setCenter(center);
      webGL.draw();
    } else if ("r" === key) {
      domainSize.reset();
      center[0] = 0;
      center[1] = 0;
      webGL.setDomainSize(domainSize.get());
      webGL.setCenter(center);
      webGL.draw();
    } else if ("s" === key && enableImageSaver) {
      canvas.saveImage("image.jpeg");
    }
  });
}

function main({ enableImageSaver }: { enableImageSaver: boolean }) {
  const canvas = new Canvas({ elementId: "canvas" });
  const gl: WebGL2RenderingContext = canvas.getWebGL2RenderingContext();
  const domainSize = new DomainSize();
  const center: [number, number] = [0, 0];
  const webGL = new WebGL(gl);
  webGL.setDomainSize(domainSize.get());
  webGL.setOrbitType([1, 2, 3].toSorted(() => Math.random() - 0.5)[0]);
  webGL.setCenter(center);
  webGL.setOrbitTrapCenter([Math.E * (Math.random() - 0.5), Math.E * (Math.random() - 0.5)]);
  webGL.setRecurrenceOffset([Math.E * (Math.random() - 0.5), Math.E * (Math.random() - 0.5)]);
  window.addEventListener("resize", () => {
    canvas.adjustSize();
    webGL.updateResolution(canvas.getWidth(), canvas.getHeight());
    webGL.draw();
  });
  window.addEventListener("wheel", (event: WheelEvent) => {
    domainSize.update(event.deltaY * 0.05);
    webGL.setDomainSize(domainSize.get());
    webGL.draw();
  });
  registerKeydownEvent(enableImageSaver, canvas, domainSize, center, webGL);
  canvas.adjustSize();
  webGL.updateResolution(canvas.getWidth(), canvas.getHeight());
  webGL.draw();
  webGL.incrementCounter();
  const animation = new Animation(60, () => {
    webGL.incrementCounter();
    webGL.draw();
  });
  animation.start();
}

window.addEventListener("load", () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  main({ enableImageSaver: urlSearchParams.has("enableImageSaver") });
});
