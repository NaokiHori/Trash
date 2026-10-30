import { createChildElement } from "./dom";
import { Body } from "./body";
import { SudokuValue, isEmpty, SUDOKU_VALUES } from "./sudokuValue";
import { NumberButton } from "./numberButtons/numberButton";

export class NumberButtons {
  private numberButtons: Array<NumberButton>;

  public constructor(body: Body) {
    const containerElement = createChildElement(HTMLDivElement, {
      tagName: "div",
      parentElement: body.getElement(),
      classListItems: ["number-buttons"],
      attributes: [],
    });
    const numberButtons = new Array<NumberButton>();
    for (const sudokuValue of SUDOKU_VALUES) {
      numberButtons.push(new NumberButton(containerElement, sudokuValue));
    }
    this.numberButtons = numberButtons;
  }

  public setOnClickHandler(handler: (clickedButtonValue: SudokuValue) => void): void {
    for (const numberButton of this.numberButtons) {
      numberButton.setOnClickHandler(() => {
        const value: SudokuValue = numberButton.getValue();
        handler(value);
      });
    }
  }

  public highlight(highlightedValue: SudokuValue): void {
    const numberButtons: Array<NumberButton> = this.numberButtons;
    for (const numberButton of numberButtons) {
      if (isEmpty(highlightedValue)) {
        numberButton.setIsHighlighted(false);
      } else if (numberButton.getValue() === highlightedValue) {
        numberButton.setIsHighlighted(true);
      } else {
        numberButton.setIsHighlighted(false);
      }
    }
  }

  public select(value: SudokuValue): void {
    const numberButtons: Array<NumberButton> = this.numberButtons;
    for (const numberButton of numberButtons) {
      if (numberButton.getValue() === value) {
        numberButton.click();
        break;
      }
    }
  }
}
