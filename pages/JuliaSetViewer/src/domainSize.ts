class ClampedValue {
  private _minValue: number;
  private _maxValue: number;
  private _defaultValue: number;
  private _value: number;

  public constructor({
    minValue,
    maxValue,
    defaultValue,
  }: {
    minValue: number;
    maxValue: number;
    defaultValue: number;
  }) {
    this._value = defaultValue;
    this._minValue = minValue;
    this._maxValue = maxValue;
    this._defaultValue = defaultValue;
    this.clampValue();
  }

  public set(newValue: number) {
    this._value = newValue;
    this.clampValue();
  }

  public get(): number {
    return this._value;
  }

  public reset() {
    this._value = this._defaultValue;
  }

  private clampValue() {
    this._value = Math.min(this._maxValue, this._value);
    this._value = Math.max(this._minValue, this._value);
  }
}

export class DomainSize {
  private _domainSize: ClampedValue;

  public constructor() {
    this._domainSize = new ClampedValue({
      minValue: -10,
      maxValue: 2,
      defaultValue: 2,
    });
  }

  public get(): number {
    return Math.exp(this._domainSize.get());
  }

  public update(increment: number) {
    this._domainSize.set(this._domainSize.get() + increment);
  }

  public reset() {
    this._domainSize.reset();
  }
}
