import { createChildElement } from "../dom";
import { EditMode } from "../editMode";

export class EditModeButton {
  private element: Readonly<HTMLButtonElement>;
  private editMode: Readonly<EditMode>;
  private isSelected: boolean;

  public constructor(containerElement: HTMLDivElement, editMode: EditMode, isSelected: boolean) {
    const element = createChildElement(HTMLButtonElement, {
      tagName: "button",
      parentElement: containerElement,
      classListItems: ["mode-button"],
      attributes: [],
    });
    element.textContent = editMode;
    this.element = element;
    this.editMode = editMode;
    this.isSelected = isSelected;
    this.updateSelectedAttribute(isSelected);
  }

  public setClickEventHandler(handler: () => void): void {
    this.element.addEventListener("click", (event: Event) => {
      event.stopPropagation();
      handler();
    });
  }

  public getEditMode(): EditMode {
    return this.editMode;
  }

  public getIsSelected(): boolean {
    return this.isSelected;
  }

  public setIsSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
    this.updateSelectedAttribute(isSelected);
  }

  private updateSelectedAttribute(isSelected: boolean): void {
    this.element.setAttribute("selected", isSelected.toString());
  }
}
