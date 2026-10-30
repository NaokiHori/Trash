import { Body } from "./body";
import { createChildElement } from "./dom";
import { EditModeButton } from "./editMode/editModeButton";

export type EditMode = "Init" | "Normal" | "Memo";

export class EditModes {
  private editModeButtons: Readonly<Array<EditModeButton>>;

  public constructor(body: Body) {
    const containerElement = createChildElement(HTMLDivElement, {
      tagName: "div",
      parentElement: body.getElement(),
      classListItems: ["mode-buttons"],
      attributes: [],
    });
    const editModeButtons = new Array<EditModeButton>();
    editModeButtons.push(
      new EditModeButton(containerElement, "Init", false),
      new EditModeButton(containerElement, "Normal", true),
      new EditModeButton(containerElement, "Memo", false),
    );
    for (const editModeButton of editModeButtons) {
      editModeButton.setClickEventHandler(() => {
        this.changeTo(editModeButton.getEditMode());
      });
    }
    this.editModeButtons = editModeButtons;
  }

  public getCurrentMode(): EditMode {
    const editModeButtons = this.editModeButtons;
    for (const editModeButton of editModeButtons) {
      if (editModeButton.getIsSelected()) {
        return editModeButton.getEditMode();
      }
    }
    throw new Error("No mode is selected");
  }

  public changeTo(editMode: EditMode): void {
    const editModeButtons = this.editModeButtons;
    for (const editModeButton of editModeButtons) {
      editModeButton.setIsSelected(editModeButton.getEditMode() === editMode);
    }
  }
}
