export class SvgItem {
  protected element: Element;

  public constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    this.element = document.createElementNS(namespaceUri, qualifiedName);
  }

  public remove(): void {
    this.element.remove();
  }

  public getElement(): Readonly<Element> {
    return this.element;
  }
}
