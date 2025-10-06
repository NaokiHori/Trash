import * as Utils from "./util";

const DARK_GRAY = "#272625";
const WHITE = "#ffffff";

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
      // border color is colored in the same way as the roulette
      // once finalized, make it darker to be less visible
      labelElement.style.borderColor =
        index === selectedIndex
          ? Utils.getColor(this.nColors, isFinalized, true, index)
          : DARK_GRAY;
      // font color is normally white
      // once finalized, make it darker to be less visible
      labelElement.style.color = isFinalized
        ? index === selectedIndex
          ? WHITE
          : DARK_GRAY
        : WHITE;
    }
    this.rouletteElement.style.background = Utils.getBackground(
      this.nColors,
      isFinalized,
      selectedIndex,
    );
  }
}
