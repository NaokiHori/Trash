import { getElementByIdOrThrow } from "./dom";

export class ControllerStateText {
  private element: SVGTextElement;

  public constructor() {
    this.element = getElementByIdOrThrow(SVGTextElement, "controller-state");
  }

  public setTextContent(textContent: string): void {
    this.element.textContent = textContent;
  }

  public setPosition(x: number): void {
    this.element.setAttribute("x", x.toString());
  }

  public setIsControlled(isControlled: boolean): void {
    this.element.textContent = `Controller ${isControlled ? "On" : "Off"}`;
    this.element.setAttribute("is-controlled", isControlled.toString());
  }
}
