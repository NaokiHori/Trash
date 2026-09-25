import { Path, PathElement, PathElementM, PathElementS, Rect, Text } from "./svg";
import { downloadJpg, downloadPng, downloadSvg } from "./image";

function getUrlParameter(parameter: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

function getColorUrlParameter(parameter: string): string | null {
  const color = getUrlParameter(parameter);
  if (color === null) {
    return color;
  }
  return `#${color}`;
}

function getElementByIdOrThrow<T extends Element>(
  type: new (...args: unknown[]) => T,
  id: string,
): T {
  const element = document.querySelector(`#${id}`);
  if (null === element) {
    throw new Error();
  }
  if (!(element instanceof type)) {
    throw new Error();
  }
  return element;
}

type Point = [number, number];

function getWavePath(size: number): Array<PathElement> {
  const width = (5 / 8) * size;
  const nwaves = 5;
  const eachWaveWidth = width / nwaves;
  const waveAmp = 0.065 * size;
  const y = 0.225 * size;
  const xs = [-2, -1, 0, 1, 2].map((x: number): number => x * eachWaveWidth);
  const result = new Array<PathElement>();
  for (const [i, x] of xs.entries()) {
    const b: Point = [x - 0.5 * eachWaveWidth, y];
    const e: Point = [x + 0.5 * eachWaveWidth, y];
    const c: Point = [x, 0 === i % 2 ? y - waveAmp : y + waveAmp];
    result.push(new PathElementM(b), new PathElementS([c, e]));
  }
  return result;
}

function rotate(p: Readonly<Point>, arg: number): Point {
  return [p[0] * Math.cos(arg) - p[1] * Math.sin(arg), p[0] * Math.sin(arg) + p[1] * Math.cos(arg)];
}

function translate(p: Readonly<Point>, dp: Readonly<Point>): Point {
  return [p[0] + dp[0], p[1] + dp[1]];
}

function getSpiralPath(size: number, isLeft: boolean): Array<PathElement> {
  // Center points calculation
  const cx = isLeft ? -0.2 * size : 0.2 * size;
  const cy = -0.1 * size + (isLeft ? 0.01885 * size : -0.01885 * size);
  // Angle range calculations
  const nargs = 32;
  const baseShift = 0.125 * Math.PI - (isLeft ? Math.PI : 0);
  const argMin = baseShift;
  const argMax = 4 * Math.PI + baseShift;
  const step = (argMax - argMin) / nargs;
  const args = Array.from({ length: nargs }, (_, i) => argMax - i * step);
  const darg = (args[nargs - 1] - args[0]) / nargs;
  const dr = 0.005 * size;
  let r = 0.015 * size;
  const result = new Array<PathElement>();
  for (const arg of args) {
    const bRaw: Point = [r, 0];
    const eRaw: Point = rotate([r + dr, 0], darg);
    const cRaw: Point = [0.52 * bRaw[0] + 0.52 * eRaw[0], 0.52 * bRaw[1] + 0.52 * eRaw[1]];
    const center: Point = [cx, cy];
    const b = translate(rotate(bRaw, arg), center);
    const e = translate(rotate(eRaw, arg), center);
    const c = translate(rotate(cRaw, arg), center);
    result.push(new PathElementM(b), new PathElementS([c, e]));
    r += dr;
  }
  return result;
}

function setupDownload(graph: SVGSVGElement): void {
  const downloadOpenButton = getElementByIdOrThrow(HTMLButtonElement, "download-open");
  const downloadDialog = getElementByIdOrThrow(HTMLDialogElement, "download-dialog");
  const downloadCancelButton = getElementByIdOrThrow(HTMLButtonElement, "download-cancel");
  const downloadForm = getElementByIdOrThrow(HTMLFormElement, "download-form");
  if (!(downloadDialog instanceof HTMLDialogElement)) {
    throw new Error();
  }
  if (!(downloadForm instanceof HTMLFormElement)) {
    throw new Error();
  }
  downloadOpenButton.addEventListener("click", () => {
    downloadDialog.showModal();
  });
  downloadCancelButton.addEventListener("click", () => {
    downloadDialog.close();
  });
  downloadForm.addEventListener("submit", () => {
    const format = new FormData(downloadForm).get("format");
    if (null === format) {
      return;
    }
    const size = Number(new FormData(downloadForm).get("size"));
    const prefix = "logo";
    switch (format) {
      case "jpg":
        downloadJpg(graph, prefix, size);
        break;
      case "png":
        downloadPng(graph, prefix, size);
        break;
      case "svg":
        downloadSvg(graph, prefix, size);
        break;
      default:
      // nothing to do
    }
  });
}

function main(): void {
  const size = 100;
  const graph = getElementByIdOrThrow(SVGSVGElement, "graph");
  if (!(graph instanceof SVGSVGElement)) {
    throw new Error();
  }
  const foregroundColor = getColorUrlParameter("foreground-color");
  const backgroundColor = getColorUrlParameter("background-color");
  const rect = new Rect(-0.5 * size, -0.5 * size, size, size);
  const waterMark = new Text("Naoki HORI", 0, 0.45 * size, "#fdca42");
  rect.setFill(backgroundColor ?? "#ffcc44");
  const pathElementsList = [
    getWavePath(size),
    getSpiralPath(size, true),
    getSpiralPath(size, false),
  ];
  graph.append(rect.getElement());
  graph.append(waterMark.getElement());
  for (const pathElements of pathElementsList) {
    const path = new Path(pathElements);
    path.setFill("transparent");
    path.setStroke(foregroundColor ?? "#664400");
    path.setStrokeWidth(5);
    path.setStrokeLinecap("round");
    graph.append(path.getElement());
  }
  setupDownload(graph);
}

window.addEventListener("load", () => {
  main();
});
