import { getElementByIdOrThrow } from "./dom";
import { Equations } from "./equation";
import { rgbToHsv } from "./convert";

function convertX(canvasWidth: number, margin: [number, number], x: number): number {
  return margin[0] + (canvasWidth - margin[0] - margin[1]) * x;
}

function convertY(canvasHeight: number, margin: [number, number], y: number): number {
  return canvasHeight - margin[0] - (canvasHeight - margin[0] - margin[1]) * y;
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  lineWidth: number,
  lineColor: string,
  marginX: [number, number],
  marginY: [number, number],
  points: Readonly<Array<Coordinate>>,
): void {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(
    convertX(canvasWidth, marginX, points[0].x),
    convertY(canvasHeight, marginY, points[0].y),
  );
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(
      convertX(canvasWidth, marginX, points[i].x),
      convertY(canvasHeight, marginY, points[i].y),
    );
  }
  ctx.stroke();
}

interface Coordinate {
  x: number;
  y: number;
}

export class Graph {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private titles: { rgb: HTMLDivElement; hsv: HTMLDivElement };
  private displayHsv: boolean;

  public constructor({ elementId }: { elementId: string }) {
    const canvas = getElementByIdOrThrow(HTMLCanvasElement, elementId);
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (null === ctx) {
      throw new Error("Failed to get context");
    }
    const rect: DOMRect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const titles = {
      rgb: getElementByIdOrThrow(HTMLDivElement, "graph-title-rgb"),
      hsv: getElementByIdOrThrow(HTMLDivElement, "graph-title-hsv"),
    };
    this.canvas = canvas;
    this.ctx = ctx;
    this.titles = titles;
    this.displayHsv = false;
  }

  private setupPoints(equations: Equations): Readonly<Array<Readonly<Array<Coordinate>>>> {
    const resolution = 1024;
    const points = [
      Array.from<Coordinate>({ length: resolution }),
      Array.from<Coordinate>({ length: resolution }),
      Array.from<Coordinate>({ length: resolution }),
    ];
    for (let i = 0; i < resolution; i += 1) {
      const x = (i + 1) / (resolution + 1);
      const r = equations.red(x);
      const g = equations.green(x);
      const b = equations.blue(x);
      if (this.displayHsv) {
        const [h, s, v] = rgbToHsv([r, g, b]);
        points[0][i] = {
          x,
          y: h,
        };
        points[1][i] = {
          x,
          y: s,
        };
        points[2][i] = {
          x,
          y: v,
        };
      } else {
        points[0][i] = {
          x,
          y: r,
        };
        points[1][i] = {
          x,
          y: g,
        };
        points[2][i] = {
          x,
          y: b,
        };
      }
    }
    return points;
  }

  public draw(equations: Equations): void {
    const canvas: HTMLCanvasElement = this.canvas;
    const ctx: CanvasRenderingContext2D = this.ctx;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const marginX: [number, number] = [canvasWidth * 0.1, canvasWidth * 0.025];
    const marginY: [number, number] = [canvasHeight * 0.1, canvasHeight * 0.05];
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawLine(ctx, canvasWidth, canvasHeight, 10, "#000000", marginX, marginY, [
      { x: 1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ]);
    const lineWidth = 5;
    const points = this.setupPoints(equations);
    const lineColors = [
      this.displayHsv ? "#00FFFF" : "#FF0000",
      this.displayHsv ? "#FF00FF" : "#00FF00",
      this.displayHsv ? "#FFFF00" : "#0000FF",
    ];
    for (let j = 0; j < 3; j += 1) {
      drawLine(
        ctx,
        canvasWidth,
        canvasHeight,
        lineWidth,
        lineColors[j],
        marginX,
        marginY,
        points[j],
      );
    }
  }

  public setClickHandler(onClick: () => void): void {
    this.canvas.addEventListener("click", () => {
      this.displayHsv = !this.displayHsv;
      this.titles.rgb.setAttribute("style", `display: ${this.displayHsv ? "none" : "inline"};`);
      this.titles.hsv.setAttribute("style", `display: ${this.displayHsv ? "inline" : "none"};`);
      onClick();
    });
  }
}
