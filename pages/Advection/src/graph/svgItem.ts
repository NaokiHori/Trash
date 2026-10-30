export class SvgItem {
  protected element: Element;

  public constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    const element: Element = document.createElementNS(namespaceUri, qualifiedName);
    element.setAttribute("visibility", true.toString());
    this.element = element;
  }

  public remove(): void {
    this.element.remove();
  }

  public getElement(): Readonly<Element> {
    return this.element;
  }
}
