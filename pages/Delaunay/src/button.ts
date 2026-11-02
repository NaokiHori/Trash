import { getElementByIdOrThrow } from "./dom";

export class Button {
  private clickCounter: number;
  private element: HTMLButtonElement;

  public constructor(elementId: string) {
    const element = getElementByIdOrThrow(elementId);
    if (!(element instanceof HTMLButtonElement)) {
      throw new TypeError();
    }
    this.clickCounter = 0;
    this.element = element;
  }

  public onClick(
    handlers: [(button: Button) => void, (button: Button) => void, (button: Button) => void],
  ): void {
    this.element.addEventListener("click", () => {
      const reminder = this.clickCounter % 3;
      if (0 === reminder) {
        handlers[0](this);
      } else if (1 === reminder) {
        handlers[1](this);
      } else {
        handlers[2](this);
      }
      this.clickCounter += 1;
    });
  }

  public setDisabled(flag: boolean): void {
    this.element.disabled = flag;
  }

  public setTextContent(textContent: string): void {
    this.element.textContent = textContent;
  }
}
