import { getElementById } from "./dom";

export class Button {
  private _clickCounter: number;
  private _element: HTMLButtonElement;

  public constructor(elementId: string) {
    const element = getElementById(elementId) as HTMLButtonElement;
    this._clickCounter = 0;
    this._element = element;
  }

  public onClick(
    handlers: [(button: Button) => void, (button: Button) => void],
  ) {
    this._element.addEventListener("click", () => {
      this._clickCounter += 1;
      if (1 === this._clickCounter) {
        handlers[0](this);
      } else if (2 === this._clickCounter) {
        handlers[1](this);
      } else {
        console.log("button is clicked for more than twice");
      }
    });
  }

  public set disabled(flag: boolean) {
    this._element.disabled = flag;
  }

  public set textContent(textContent: string) {
    this._element.textContent = textContent;
  }
}
