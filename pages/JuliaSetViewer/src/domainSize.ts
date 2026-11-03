import { ClampedValue } from "./domainSize/clampedValue";

export class DomainSize {
  private domainSize: ClampedValue;

  public constructor() {
    this.domainSize = new ClampedValue({
      minValue: -10,
      maxValue: 2,
      defaultValue: 2,
    });
  }

  public get(): number {
    return Math.exp(this.domainSize.get());
  }

  public update(increment: number): void {
    this.domainSize.set(this.domainSize.get() + increment);
  }

  public reset(): void {
    this.domainSize.reset();
  }
}
