import { Point, Edge, Triangle, twoPointsEqual, edgesOverlap } from "./types";

export class Triangulator {
  private _auxiliaryTriangle: Triangle | null;
  public triangles: Array<Triangle>;

  public constructor() {
    this.triangles = new Array<Triangle>();
    this._auxiliaryTriangle = null;
  }

  public reset() {
    this.triangles = new Array<Triangle>();
    this._auxiliaryTriangle = null;
  }

  public setupAuxiliaryTriangle(points: Array<Point>) {
    const min: Point = {
      x: Number.MAX_VALUE,
      y: Number.MAX_VALUE,
    };
    const max: Point = {
      x: -Number.MAX_VALUE,
      y: -Number.MAX_VALUE,
    };
    for (const point of points) {
      min.x = Math.min(min.x, point.x);
      min.y = Math.min(min.y, point.y);
      max.x = Math.max(max.x, point.x);
      max.y = Math.max(max.y, point.y);
    }
    const middle: Point = {
      x: 0.5 * min.x + 0.5 * max.x,
      y: 0.5 * min.y + 0.5 * max.y,
    };
    const delta = Math.max(max.x - min.x, max.y - min.y);
    const auxiliaryTriangle: Triangle = [
      {
        x: middle.x - 100 * delta,
        y: middle.y - 100 * delta,
      },
      {
        x: middle.x,
        y: middle.y + 100 * delta,
      },
      {
        x: middle.x + 100 * delta,
        y: middle.y - 100 * delta,
      },
    ];
    this._auxiliaryTriangle = auxiliaryTriangle;
    this.triangles.push(auxiliaryTriangle);
  }

  public removeAuxiliaryTriangle() {
    const auxiliaryTriangle = this._auxiliaryTriangle;
    if (auxiliaryTriangle === null) {
      return;
    }
    this.triangles = this.triangles.filter((triangle: Triangle) => {
      let toBeRemoved = false;
      for (const vertex of triangle) {
        if (
          twoPointsEqual(vertex, auxiliaryTriangle[0]) ||
          twoPointsEqual(vertex, auxiliaryTriangle[1]) ||
          twoPointsEqual(vertex, auxiliaryTriangle[2])
        ) {
          toBeRemoved = true;
          break;
        }
      }
      return !toBeRemoved;
    });
  }

  public addPoint(point: Point) {
    const [goodTriangles, badTriangles] = findBadTriangles(
      point,
      this.triangles,
    );
    const edges = findUniqueEdges(badTriangles);
    const newTriangles = createTriangles(point, edges);
    this.triangles = goodTriangles.concat(newTriangles);
  }
}

function findBadTriangles(
  point: Point,
  allTriangles: Array<Triangle>,
): [Array<Triangle>, Array<Triangle>] {
  const goods = new Array<Triangle>();
  const bads = new Array<Triangle>();
  for (const t of allTriangles) {
    if (pointIsInCircumcircle(point, t)) {
      bads.push(t);
    } else {
      goods.push(t);
    }
  }
  return [goods, bads];
}

function pointIsInCircumcircle(p: Point, t: Triangle): boolean {
  const v01 = {
    x: t[1].x - t[0].x,
    y: t[1].y - t[0].y,
  };
  const v02 = {
    x: t[2].x - t[0].x,
    y: t[2].y - t[0].y,
  };
  const op = 2 * (v01.x * v02.y - v01.y * v02.x);
  const q1 = v01.x ** 2 + v01.y ** 2;
  const q2 = v02.x ** 2 + v02.y ** 2;
  const center = {
    x: (v02.y * q1 - v01.y * q2) / op,
    y: (v01.x * q2 - v02.x * q1) / op,
  };
  const radius2 = center.x ** 2 + center.y ** 2;
  const d = {
    x: p.x - center.x - t[0].x,
    y: p.y - center.y - t[0].y,
  };
  return d.x ** 2 + d.y ** 2 < radius2;
}

function findUniqueEdges(triangles: Array<Triangle>): Array<Edge> {
  let edges = new Array<Edge>();
  for (const t of triangles) {
    for (let i = 0; i < 3; i++) {
      const newEdge: Edge = [t[(i + 0) % 3], t[(i + 1) % 3]];
      edges = addNewEdge(newEdge, edges);
    }
  }
  return edges;
}

function addNewEdge(newEdge: Edge, edges: Array<Edge>): Array<Edge> {
  const oldLength = edges.length;
  edges = edges.filter((edge: Edge) => !edgesOverlap(newEdge, edge));
  const newLength = edges.length;
  if (oldLength === newLength) {
    edges.push(newEdge);
  }
  return edges;
}

function createTriangles(point: Point, edges: Array<Edge>): Array<Triangle> {
  const triangles = new Array<Triangle>();
  for (const edge of edges) {
    const t: Triangle = [edge[0], edge[1], point];
    triangles.push(t);
  }
  return triangles;
}
