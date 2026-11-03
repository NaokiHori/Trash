import { getElementByIdOrThrow } from "../../../common/dom";

export class DivElement {
  private divElement: HTMLDivElement;

  public constructor(id: string) {
    this.divElement = getElementByIdOrThrow(HTMLDivElement, id);
  }

  public setTextContent(textContent: string): void {
    this.divElement.textContent = textContent;
  }
}
