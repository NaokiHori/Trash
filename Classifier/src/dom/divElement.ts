import { getElementByIdOrThrow } from "../dom";

export class DivElement {
  private divElement: HTMLDivElement;

  public constructor(elementId: string) {
    this.divElement = getElementByIdOrThrow(HTMLDivElement, elementId);
  }

  public setTextContent(textContent: string): void {
    this.divElement.textContent = textContent;
  }
}
