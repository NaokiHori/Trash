import * as Utils from "./util";

const DEFAULT_LABEL_COLOR = "#272727";

export class RouletteView {
  private readonly rouletteElement: HTMLElement;
  private readonly labelElements: Array<HTMLElement>;
  private readonly nColors: number;

  public constructor(members: ReadonlyArray<string>) {
    const rouletteElement = document.getElementById("roulette");
    if (rouletteElement === null) {
      throw new Error("roulette element not found");
    }
    const labelsElement = document.getElementById("labels");
    if (labelsElement === null) {
      throw new Error("labels element not found");
    }
    const labelElements = members.map((member: string) => {
      const labelElement = document.createElement("div");
      labelElement.className = "label";
      labelElement.textContent = member;
      labelsElement.appendChild(labelElement);
      return labelElement;
    });
    const nColors = members.length;
    this.rouletteElement = rouletteElement;
    this.labelElements = labelElements;
    this.nColors = nColors;
  }

  public draw(selectedIndex: number, isFinalized: boolean) {
    for (const [index, labelElement] of this.labelElements.entries()) {
      labelElement.style.backgroundColor =
        index === selectedIndex
          ? Utils.getColor(this.nColors, isFinalized, true, index)
          : DEFAULT_LABEL_COLOR;
    }
    const background = Utils.getBackground(
      this.nColors,
      isFinalized,
      selectedIndex,
    );
    this.rouletteElement.style.background = background;
  }
}
