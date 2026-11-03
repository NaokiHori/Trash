export class ClampedValue {
  private minValue: number;
  private maxValue: number;
  private defaultValue: number;
  private value: number;

  public constructor({
    minValue,
    maxValue,
    defaultValue,
  }: {
    minValue: number;
    maxValue: number;
    defaultValue: number;
  }) {
    this.value = defaultValue;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.defaultValue = defaultValue;
    this.clampValue();
  }

  public set(newValue: number): void {
    this.value = newValue;
    this.clampValue();
  }

  public get(): number {
    return this.value;
  }

  public reset(): void {
    this.value = this.defaultValue;
  }

  private clampValue(): void {
    this.value = Math.min(this.maxValue, this.value);
    this.value = Math.max(this.minValue, this.value);
  }
}
