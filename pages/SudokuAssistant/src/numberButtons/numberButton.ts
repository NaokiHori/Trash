import { createChildElement } from "../dom";
import { SudokuValue, isEmpty } from "../sudokuValue";

export class NumberButton {
  private element: Readonly<HTMLButtonElement>;
  private value: SudokuValue;

  public constructor(containerElement: HTMLDivElement, value: SudokuValue) {
    const buttonElement = createChildElement(HTMLButtonElement, {
      tagName: "button",
      parentElement: containerElement,
      classListItems: ["number-button"],
      attributes: [],
    });
    buttonElement.textContent = isEmpty(value) ? "" : value.toString();
    this.element = buttonElement;
    this.value = value;
    this.setIsHighlighted(false);
  }

  public setOnClickHandler(handler: () => void): void {
    this.element.addEventListener("click", (event: Event) => {
      event.stopPropagation();
      handler();
    });
  }

  public getValue(): SudokuValue {
    return this.value;
  }

  public setIsHighlighted(isHighlighted: boolean): void {
    this.element.setAttribute("highlighted", isHighlighted.toString());
  }

  public click(): void {
    this.element.click();
  }
}
