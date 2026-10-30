import { querySelectorOrThrow } from "../dom";

export class DivElement {
  private divElement: HTMLDivElement;

  public constructor(query: string) {
    this.divElement = querySelectorOrThrow(HTMLDivElement, query);
  }

  public setTextContent(textContent: string): void {
    this.divElement.textContent = textContent;
  }
}
