export function getElementById(id: string): HTMLElement {
  const element: HTMLElement | null = document.getElementById(id);
  if (null === element) {
    throw new Error(`Failed to get element by ID: ${id}`);
  }
  return element;
}

export class DivElement {
  private _divElement: HTMLDivElement;

  public constructor(elementId: string) {
    const divElement = getElementById(elementId) as HTMLDivElement;
    this._divElement = divElement;
  }

  public set textContent(textContent: string) {
    this._divElement.textContent = textContent;
  }
}
