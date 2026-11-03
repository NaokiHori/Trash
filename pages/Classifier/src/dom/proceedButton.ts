import { CustomButton } from "../components/customButton";
import { getElementByIdOrThrow } from "../../../common/dom";

export class ProceedButton {
  private clickCounter: number;
  private element: CustomButton;

  public constructor(id: string) {
    this.clickCounter = 0;
    this.element = getElementByIdOrThrow(CustomButton, id);
  }

  public addClickEventListener(handler: () => void): void {
    this.element.addEventListener("click", () => {
      handler();
    });
  }

  public setDisabled(flag: boolean): void {
    this.element.setDisabled(flag);
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
