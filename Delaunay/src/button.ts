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
    handlers: [
      (button: Button) => void,
      (button: Button) => void,
      (button: Button) => void,
    ],
  ) {
    this._element.addEventListener("click", () => {
      const reminder = this._clickCounter % 3;
      if (0 === reminder) {
        handlers[0](this);
      } else if (1 === reminder) {
        handlers[1](this);
      } else {
        handlers[2](this);
      }
      this._clickCounter += 1;
    });
  }

  public set disabled(flag: boolean) {
    this._element.disabled = flag;
  }

  public set textContent(textContent: string) {
    this._element.textContent = textContent;
  }
}
