export class SvgItem {
  protected element: Element;

  public constructor(qualifiedName: string) {
    const namespaceUri = "http://www.w3.org/2000/svg";
    const element: Element = document.createElementNS(namespaceUri, qualifiedName);
    this.element = element;
    this.setIsDisplayed(false);
  }

  public remove(): void {
    this.element.remove();
  }

  public getElement(): Readonly<Element> {
    return this.element;
  }

  public setIsDisplayed(flag: boolean): void {
    const attr = flag ? "visible" : "hidden";
    this.element.setAttribute("visibility", attr);
  }
}
