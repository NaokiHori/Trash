export class Body {
  private element: Readonly<HTMLElement>;

  public constructor() {
    const element: HTMLElement = document.body;
    this.element = element;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public setOnClickHandler(handler: () => void): void {
    this.element.addEventListener("click", handler);
  }
}
