import { PathElement } from "./pathElement";

export class PathElementM implements PathElement {
  public constructor(private point: Readonly<[number, number]>) {}

  public toString(): string {
    return `M${this.point[0]} ${this.point[1]}`;
  }
}
