export class Button {
  private element: HTMLButtonElement;

  public constructor(elementId: string) {
    const element: HTMLElement | null = document.querySelector(`#${elementId}`);
    if (null === element) {
      throw new Error(`Failed to find an element: ${elementId}`);
    }
    if (!(element instanceof HTMLButtonElement)) {
      throw new TypeError();
    }
    this.element = element;
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
