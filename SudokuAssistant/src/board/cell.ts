import { Position } from "./position";
import { EMPTY_VALUE, SUDOKU_VALUES, SudokuValue, isEmpty } from "../sudokuValue";
import {
  createCellElement,
  createCellTextElement,
  createSubCellElement,
} from "./cell/createElement";

type CellMode = "Normal" | "Memo";

export const DEFAULT_CELL_MODE: CellMode = "Memo";

// check uniqueness with respect to neighbor cells
function isUnshared(sudokuValue: SudokuValue, neighborCell: Cell): boolean {
  if (neighborCell.getCellMode() !== "Memo") {
    return true;
  }
  if (!neighborCell.getSubCellValidity(sudokuValue)) {
    return true;
  }
  if (neighborCell.getSubCellDisability(sudokuValue)) {
    return true;
  }
  return false;
}

export interface ICell {
  getIsDefault(): boolean;
  setIsDefault(isDefault: boolean): void;
  getValue(): SudokuValue;
  setValue(value: SudokuValue): void;
  setCellMode(cellMode: CellMode): void;
  validate(value: SudokuValue): boolean;
  resetDisabledMemoValues(): void;
  getSubCellDisability(value: SudokuValue): boolean;
  setSubCellDisability(value: SudokuValue, isDisabled: boolean): void;
  setSubCellValidity(value: SudokuValue, isValid: boolean): void;
  validateAndUpdateMemoValues(): void;
  updateUniquenessOfMemoValues(): void;
  getIsSelected(): boolean;
  setIsSelected(isSelected: boolean): void;
  getPosition(): Position;
  neighborCells: {
    sameRow: Array<Cell>;
    sameColumn: Array<Cell>;
    sameBlock: Array<Cell>;
  };
}

export class Cell implements ICell {
  private position: Readonly<Position>;
  private cellElement: Readonly<HTMLDivElement>;
  private cellTextElement: HTMLDivElement;
  private subCellElements: Readonly<ReadonlyArray<HTMLDivElement>>;
  private subCellValuesValid: Array<boolean>;
  private subCellValuesUnique: Array<boolean>;
  private subCellValuesDisabled: Array<boolean>;
  private value: SudokuValue;
  private isDefault: boolean;
  private isSelected: boolean;
  private cellMode: CellMode;
  public neighborCells: {
    sameRow: Array<Cell>;
    sameColumn: Array<Cell>;
    sameBlock: Array<Cell>;
  };

  public constructor(containerElement: HTMLElement, position: Position) {
    // element to contain
    //   1. normal value
    //   2. nine memo values
    const cellElement = createCellElement(containerElement, position);
    // element to keep normal value, which is vertically centered
    const cellTextElement = createCellTextElement(cellElement);
    // elements to keep memo values
    // NOTE: include a dummy element (0-th element) for convenience,
    //   which is hidden by configuring "display: none"
    const subCellElements = SUDOKU_VALUES.map((sudokuValue: SudokuValue) =>
      createSubCellElement(cellElement, sudokuValue),
    );
    this.position = position;
    this.cellElement = cellElement;
    this.cellTextElement = cellTextElement;
    this.subCellElements = subCellElements;
    // initially assume all candidates are valid
    this.subCellValuesValid = Array.from<boolean>({
      length: SUDOKU_VALUES.length,
    }).fill(true);
    this.subCellValuesUnique = Array.from<boolean>({
      length: SUDOKU_VALUES.length,
    }).fill(false);
    this.subCellValuesDisabled = Array.from<boolean>({
      length: SUDOKU_VALUES.length,
    }).fill(false);
    this.value = EMPTY_VALUE;
    this.isDefault = false;
    this.isSelected = false;
    this.cellMode = DEFAULT_CELL_MODE;
    this.neighborCells = {
      sameRow: new Array<Cell>(),
      sameColumn: new Array<Cell>(),
      sameBlock: new Array<Cell>(),
    };
  }

  public setOnClickHandler(handler: (cellValue: SudokuValue) => void): void {
    this.cellElement.addEventListener("click", (event: Event) => {
      // disable the body element click event
      event.stopPropagation();
      // invoke passed handler
      handler(this.getValue());
      // select this cell
      this.setIsSelected(true);
    });
  }

  public reset(): void {
    this.setIsDefault(false);
    this.setIsSelected(false);
    this.setCellMode(DEFAULT_CELL_MODE);
    this.setValue(EMPTY_VALUE);
    for (const value of SUDOKU_VALUES) {
      this.setSubCellValidity(value, true);
      this.setSubCellUniqueness(value, false);
      this.setSubCellDisability(value, false);
    }
  }

  public getValue(): SudokuValue {
    return this.value;
  }

  public setValue(value: SudokuValue): void {
    this.value = value;
    this.cellTextElement.textContent = isEmpty(value) ? "" : value.toString();
  }

  public getIsSelected(): boolean {
    return this.isSelected;
  }

  public setIsSelected(flag: boolean): void {
    this.isSelected = flag;
    this.cellElement.setAttribute("isSelected", flag.toString());
  }

  public setIsHighlighted(flag: boolean): void {
    this.cellElement.setAttribute("isHighlighted", flag.toString());
  }

  public getIsDefault(): boolean {
    return this.isDefault;
  }

  public setIsDefault(flag: boolean): void {
    this.isDefault = flag;
    this.cellElement.setAttribute("isDefault", flag.toString());
  }

  public getCellMode(): CellMode {
    return this.cellMode;
  }

  public setCellMode(cellMode: CellMode): void {
    this.cellMode = cellMode;
    this.cellElement.setAttribute("cellMode", cellMode);
  }

  public getPosition(): Position {
    return this.position;
  }

  public getSubCellValidity(value: SudokuValue): boolean {
    return this.subCellValuesValid[value];
  }

  public setSubCellValidity(value: SudokuValue, isValid: boolean): void {
    this.subCellValuesValid[value] = isValid;
    this.subCellElements[value].setAttribute("isValid", isValid.toString());
  }

  public getSubCellDisability(value: SudokuValue): boolean {
    return this.subCellValuesDisabled[value];
  }

  public setSubCellDisability(value: SudokuValue, isDisabled: boolean): void {
    this.subCellValuesDisabled[value] = isDisabled;
    this.subCellElements[value].setAttribute("isDisabled", isDisabled.toString());
  }

  public highlightSubCell(value: SudokuValue): void {
    for (const sudokuValue of SUDOKU_VALUES) {
      this.subCellElements[sudokuValue].setAttribute(
        "isHighlighted",
        (sudokuValue === value).toString(),
      );
    }
  }

  public validate(newValue: SudokuValue): boolean {
    // fetch all neighbor cells
    const neighborCells = this.neighborCells;
    for (const neighborCell of neighborCells.sameRow) {
      if (neighborCell.getValue() === newValue) {
        return false;
      }
    }
    for (const neighborCell of neighborCells.sameColumn) {
      if (neighborCell.getValue() === newValue) {
        return false;
      }
    }
    for (const neighborCell of neighborCells.sameBlock) {
      if (neighborCell.getValue() === newValue) {
        return false;
      }
    }
    return true;
  }

  public resetDisabledMemoValues(): void {
    for (const sudokuValue of SUDOKU_VALUES) {
      this.setSubCellDisability(sudokuValue, false);
    }
  }

  public validateAndUpdateMemoValues(): void {
    // for each value, check if it is a valid candidate
    //   (by checking neighbor cells)
    //   and update the flag
    for (const sudokuValue of SUDOKU_VALUES) {
      this.setSubCellValidity(sudokuValue, this.validate(sudokuValue));
    }
  }

  public updateUniquenessOfMemoValues(): void {
    if (this.getCellMode() !== "Memo") {
      return;
    }
    for (const sudokuValue of SUDOKU_VALUES) {
      // reset uniqueness to be false (default)
      this.setSubCellUniqueness(sudokuValue, false);
      if (isEmpty(sudokuValue)) {
        // we are only interested in non-empty value
        continue;
      }
      if (!this.getSubCellValidity(sudokuValue)) {
        // this memo value is no longer applicable
        continue;
      }
      // check if this value is the only candidate in this cell
      if (this.isOnlyCandidate(sudokuValue)) {
        this.setSubCellUniqueness(sudokuValue, true);
      }
      const neighborCells = this.neighborCells;
      if (
        neighborCells.sameRow.every((neighborCell: Cell) =>
          isUnshared(sudokuValue, neighborCell),
        ) ||
        neighborCells.sameColumn.every((neighborCell: Cell) =>
          isUnshared(sudokuValue, neighborCell),
        ) ||
        neighborCells.sameBlock.every((neighborCell: Cell) => isUnshared(sudokuValue, neighborCell))
      ) {
        this.setSubCellUniqueness(sudokuValue, true);
      }
    }
  }

  private setSubCellUniqueness(value: SudokuValue, isUnique: boolean): void {
    this.subCellValuesUnique[value] = isUnique;
    this.subCellElements[value].setAttribute("isUnique", isUnique.toString());
  }

  private isOnlyCandidate(value: SudokuValue): boolean {
    for (const sudokuValue of SUDOKU_VALUES) {
      if (sudokuValue === value) {
        continue;
      }
      if (!this.getSubCellValidity(sudokuValue)) {
        continue;
      }
      if (this.getSubCellDisability(sudokuValue)) {
        continue;
      }
      return false;
    }
    return true;
  }
}
