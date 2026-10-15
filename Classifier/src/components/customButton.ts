import style from "./custom-button.css?inline";

export class CustomButton extends HTMLElement {
  // NOTE: consider a better way to set disabled flag
  private buttonElement: HTMLButtonElement;

  public constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(style);
    shadow.adoptedStyleSheets = [styleSheet];
    shadow.innerHTML = `<button id="self" class="custom-button"><slot></slot></button>`;
    const buttonElement = shadow.querySelector("#self");
    if (null === buttonElement) {
      throw new Error();
    }
    if (!(buttonElement instanceof HTMLButtonElement)) {
      throw new Error();
    }
    this.buttonElement = buttonElement;
  }

  public setDisabled(flag: boolean): void {
    this.buttonElement.disabled = flag;
  }
}

customElements.define("custom-button", CustomButton);
