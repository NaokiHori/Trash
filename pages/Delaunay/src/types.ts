export interface Point {
  x: number;
  y: number;
}

export type Edge = [Point, Point];

export type Triangle = [Point, Point, Point];

export function twoPointsEqual(pointA: Point, pointB: Point): boolean {
  return pointA === pointB;
}

export function edgesOverlap(edgeA: Edge, edgeB: Edge): boolean {
  if (edgeA[0] === edgeB[0] && edgeA[1] === edgeB[1]) {
    return true;
  }
  if (edgeA[0] === edgeB[1] && edgeA[1] === edgeB[0]) {
    return true;
  }
  return false;
}
