import { Path, PathElement, PathElementM, PathElementS, Rect, Text } from "./svg";
import { downloadJpg, downloadPng, downloadSvg } from "./image";

function getUrlParameter(parameter: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(parameter);
}

function getColorUrlParameter(parameter: string): string | null {
  const color = getUrlParameter(parameter);
  if (color) {
    return `#${color}`;
  } else {
    return color;
  }
}

function getElementByIdOrThrow(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (null === element) {
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
    result.push(new PathElementM(b));
    result.push(new PathElementS([c, e]));
  }
  return result;
}

function getSpiralPath(size: number, isLeft: boolean): Array<PathElement> {
  const rotate = (p: Point, arg: number): Point => [
    p[0] * Math.cos(arg) - p[1] * Math.sin(arg),
    p[0] * Math.sin(arg) + p[1] * Math.cos(arg),
  ];
  const translate = (p: Point, dp: Point): Point => [p[0] + dp[0], p[1] + dp[1]];
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
  const darg = (args[args.length - 1] - args[0]) / nargs;
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
    result.push(new PathElementM(b));
    result.push(new PathElementS([c, e]));
    r += dr;
  }
  return result;
}

function main() {
  const size = 100;
  const graph = getElementByIdOrThrow("graph");
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
  graph.appendChild(rect.getElement());
  graph.appendChild(waterMark.getElement());
  pathElementsList.forEach((pathElements: Array<PathElement>) => {
    const path = new Path(pathElements);
    path.setFill("transparent");
    path.setStroke(foregroundColor ?? "#664400");
    path.setStrokeWidth(5);
    path.setStrokeLinecap("round");
    graph.appendChild(path.getElement());
  });
  const downloadOpenButton = getElementByIdOrThrow("download-open");
  const downloadDialog = getElementByIdOrThrow("download-dialog");
  const downloadCancelButton = getElementByIdOrThrow("download-cancel");
  const downloadForm = getElementByIdOrThrow("download-form");
  if (!(downloadDialog instanceof HTMLDialogElement)) {
    throw new Error();
  }
  if (!(downloadForm instanceof HTMLFormElement)) {
    throw new Error();
  }
  downloadOpenButton.addEventListener("click", () => downloadDialog.showModal());
  downloadCancelButton.addEventListener("click", () => downloadDialog.close());
  downloadForm.addEventListener("submit", () => {
    const format = new FormData(downloadForm).get("format") as string;
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
        console.warn(format, size);
    }
  });
}

window.addEventListener("load", () => {
  main();
});
