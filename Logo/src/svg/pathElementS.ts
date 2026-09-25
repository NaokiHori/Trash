import { PathElement } from "./pathElement";

export class PathElementS implements PathElement {
  public constructor(
    private points: Readonly<[Readonly<[number, number]>, Readonly<[number, number]>]>,
  ) {}

  public toString(): string {
    return `S${this.points[0][0]} ${this.points[0][1]}, ${this.points[1][0]} ${this.points[1][1]}`;
  }
}
