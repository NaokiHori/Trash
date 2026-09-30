import { getElementByIdOrThrow } from "../dom";

export class ButtonElement {
  private clickCounter: number;
  private element: HTMLButtonElement;

  public constructor(elementId: string) {
    const element = getElementByIdOrThrow(HTMLButtonElement, elementId);
    this.clickCounter = 0;
    this.element = element;
  }

  public addEventListener(handler: () => void): void {
    this.element.addEventListener("click", () => {
      handler();
    });
  }

  public setDisabled(flag: boolean): void {
    this.element.disabled = flag;
  }

  public setTextContent(textContent: string): void {
    this.element.textContent = textContent;
  }

  public getClickCounter(): number {
    return this.clickCounter;
  }

  public setClickCounter(clickCounter: number): void {
    this.clickCounter = clickCounter;
  }
}
