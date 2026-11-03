import { getElementByIdOrThrow } from "../../common/dom";

export class Button {
  private element: HTMLButtonElement;

  public constructor(elementId: string) {
    this.element = getElementByIdOrThrow(HTMLButtonElement, elementId);
    this.disable();
  }

  public setOnClickHandler(handler: () => void): void {
    this.element.addEventListener("click", () => {
      handler();
    });
  }

  public enable(): void {
    this.element.disabled = false;
  }

  public disable(): void {
    this.element.disabled = true;
  }
}
