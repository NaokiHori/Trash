import { EMPTY_VALUE, SudokuValue } from "./sudokuValue";

export class Highlight {
  private highlightedValue: SudokuValue;
  private onUpdateHandler: (highlightedValue: SudokuValue) => void;

  public constructor() {
    this.highlightedValue = EMPTY_VALUE;
    this.onUpdateHandler = (): void => {
      /* will be registered by the "value" setter */
    };
  }

  public setOnUpdateHandler(onUpdateHandler: (highlightedValue: SudokuValue) => void): void {
    this.onUpdateHandler = onUpdateHandler;
  }

  public getValue(): SudokuValue {
    return this.highlightedValue;
  }

  public setValue(highlightedValue: SudokuValue): void {
    this.highlightedValue = highlightedValue;
    this.onUpdateHandler(highlightedValue);
  }
}
