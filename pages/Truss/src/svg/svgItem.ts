export class SvgItem {
  private element: Element;

  public constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    this.element = document.createElementNS(namespaceUri, qualifiedName);
  }

  public getElement(): Readonly<Element> {
    return this.element;
  }

  public setElementAttribute(key: string, value: string): void {
    this.element.setAttribute(key, value);
  }

  protected addClassNames(classNames: Readonly<Array<string>>): void {
    for (const className of classNames) {
      this.element.classList.add(className);
    }
  }
}
