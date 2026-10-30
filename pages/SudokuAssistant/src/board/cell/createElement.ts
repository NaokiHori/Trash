import { createChildElement } from "../../dom";
import { SudokuValue, isEmpty } from "../../sudokuValue";
import { Position } from "../position";
import { DEFAULT_CELL_MODE } from "../cell";

export function createCellElement(
  containerElement: HTMLElement,
  position: Position,
): HTMLDivElement {
  return createChildElement(HTMLDivElement, {
    tagName: "div",
    parentElement: containerElement,
    classListItems: ["cell"],
    attributes: [
      { key: "cellMode", value: DEFAULT_CELL_MODE },
      { key: "row", value: position.row.toString() },
      { key: "column", value: position.column.toString() },
      { key: "isHighlighted", value: false.toString() },
      { key: "isSelected", value: false.toString() },
    ],
  });
}

export function createCellTextElement(parentElement: HTMLElement): HTMLDivElement {
  return createChildElement(HTMLDivElement, {
    tagName: "div",
    parentElement,
    classListItems: ["text"],
    attributes: [],
  });
}

export function createSubCellElement(
  parentElement: HTMLDivElement,
  sudokuValue: SudokuValue,
): HTMLDivElement {
  const subCellElement = createChildElement(HTMLDivElement, {
    tagName: "div",
    parentElement,
    classListItems: ["subcell"],
    attributes: [
      { key: "isHighlighted", value: false.toString() },
      { key: "isUnique", value: false.toString() },
      { key: "isDisabled", value: false.toString() },
    ],
  });
  const subCellTextElement = createChildElement(HTMLDivElement, {
    tagName: "div",
    parentElement: subCellElement,
    classListItems: ["text"],
    attributes: [],
  });
  subCellTextElement.textContent = sudokuValue.toString();
  if (isEmpty(sudokuValue)) {
    subCellElement.style.display = "none";
  }
  return subCellElement;
}
