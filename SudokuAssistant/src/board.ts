import { createChildElement } from "./dom";
import { Body } from "./body";
import { EditMode } from "./editMode";
import { EMPTY_VALUE, SUDOKU_VALUES, SudokuValue, isEmpty } from "./sudokuValue";
import { Cell, ICell } from "./board/cell";
import { BOARD_SIZE } from "./board/param";
import { Position } from "./board/position";
import { setNeighborCells } from "./board/setNeighborCells";

function getSelectedCell(cells: Array<ICell>): ICell | null {
  for (const cell of cells) {
    if (cell.getIsSelected()) {
      return cell;
    }
  }
  return null;
}

function validateInput(
  currentEditMode: EditMode,
  value: SudokuValue,
  selectedCell: ICell,
): boolean {
  if (currentEditMode === "Init") {
    return true;
  }
  if (selectedCell.getIsDefault()) {
    return false;
  }
  return isEmpty(value) || selectedCell.validate(value);
}

function handleMemoMode(value: SudokuValue, selectedCell: ICell): void {
  selectedCell.setCellMode("Memo");
  selectedCell.setValue(EMPTY_VALUE);
  if (isEmpty(value)) {
    selectedCell.resetDisabledMemoValues();
  } else {
    const isDisabled = selectedCell.getSubCellDisability(value);
    selectedCell.setSubCellDisability(value, !isDisabled);
  }
}

function updateCellNeighbors(value: SudokuValue, selectedCell: ICell): void {
  const neighbors = [
    ...selectedCell.neighborCells.sameRow,
    ...selectedCell.neighborCells.sameColumn,
    ...selectedCell.neighborCells.sameBlock,
  ];
  if (isEmpty(value)) {
    selectedCell.setCellMode("Memo");
    selectedCell.setIsDefault(false);
    const originalValue = selectedCell.getValue();
    selectedCell.setValue(EMPTY_VALUE);
    for (const neighbor of neighbors) {
      const isValid = neighbor.validate(originalValue);
      neighbor.setSubCellValidity(originalValue, isValid);
    }
  } else {
    selectedCell.setCellMode("Normal");
    selectedCell.setValue(value);
    for (const neighbor of neighbors) {
      neighbor.setSubCellValidity(value, false);
    }
  }
}

function resetAllCellDisabilities(cells: Array<ICell>): void {
  for (const cell of cells) {
    for (const sudokuValue of SUDOKU_VALUES) {
      cell.setSubCellDisability(sudokuValue, false);
    }
  }
}

/** @internal - exported for unit testing */
export function validateAndUpdateValue(
  currentEditMode: Readonly<EditMode>,
  value: Readonly<SudokuValue>,
  cells: Array<ICell>,
): void {
  const selectedCell = getSelectedCell(cells);
  if (selectedCell === null) {
    return;
  }
  if (!validateInput(currentEditMode, value, selectedCell)) {
    return;
  }
  selectedCell.setIsDefault(currentEditMode === "Init");
  if (currentEditMode === "Memo") {
    handleMemoMode(value, selectedCell);
  } else {
    if (currentEditMode === "Init") {
      resetAllCellDisabilities(cells);
    }
    updateCellNeighbors(value, selectedCell);
  }
  for (const cell of cells) {
    cell.validateAndUpdateMemoValues();
  }
  for (const cell of cells) {
    cell.updateUniquenessOfMemoValues();
  }
}

export class Board {
  private cells: Array<Cell>;

  public constructor(body: Body, puzzle: ReadonlyArray<ReadonlyArray<SudokuValue>>) {
    const element = createChildElement(HTMLDivElement, {
      tagName: "div",
      parentElement: body.getElement(),
      classListItems: ["board"],
      attributes: [],
    });
    const cells = new Array<Cell>();
    for (let n = 0; n < BOARD_SIZE * BOARD_SIZE; n += 1) {
      const position: Position = {
        row: Math.floor(n / BOARD_SIZE),
        column: n % BOARD_SIZE,
      };
      cells.push(new Cell(element, position));
    }
    for (const cell of cells) {
      const row = cell.getPosition().row;
      const column = cell.getPosition().column;
      const value: SudokuValue = puzzle[row][column];
      if (isEmpty(value)) {
        cell.setCellMode("Memo");
      } else {
        cell.setCellMode("Normal");
        cell.setIsDefault(true);
        cell.setValue(value);
      }
    }
    for (const cell of cells) {
      setNeighborCells(cell, cells);
    }
    // based on the current normal cell values,
    //   update all memo cells
    //   to display all possible values
    for (const cell of cells) {
      cell.validateAndUpdateMemoValues();
    }
    for (const cell of cells) {
      cell.updateUniquenessOfMemoValues();
    }
    this.cells = cells;
  }

  public setOnClickHandler(handler: (cellValue: SudokuValue) => void): void {
    const cells: Array<Cell> = this.cells;
    for (const cell of cells) {
      cell.setOnClickHandler(handler);
    }
  }

  public highlight(highlightedValue: SudokuValue): void {
    const cells: Array<Cell> = this.cells;
    for (const cell of cells) {
      switch (cell.getCellMode()) {
        case "Normal": {
          const value: SudokuValue = cell.getValue();
          cell.setIsHighlighted(!isEmpty(value) && highlightedValue === value);
          break;
        }
        case "Memo": {
          cell.setIsHighlighted(false);
          cell.highlightSubCell(highlightedValue);
          break;
        }
        // no default
      }
    }
  }

  public validateAndUpdateValue(currentEditMode: EditMode, value: SudokuValue): void {
    validateAndUpdateValue(currentEditMode, value, this.cells);
  }

  public updateSelectedCell(direction: "Down" | "Up" | "Left" | "Right"): void {
    const cells = this.cells;
    const currentSelectedCell: ICell | null = getSelectedCell(cells);
    if (currentSelectedCell === null) {
      return;
    }
    currentSelectedCell.setIsSelected(false);
    const nextSelectedCell: Cell = (function (): Cell {
      const { row, column } = currentSelectedCell.getPosition();
      const newRow: number = (function (): number {
        if (direction === "Up") {
          return (row - 1 + BOARD_SIZE) % BOARD_SIZE;
        } else if (direction === "Down") {
          return (row + 1) % BOARD_SIZE;
        }
        return row;
      })();
      const newColumn: number = (function (): number {
        if (direction === "Left") {
          return (column - 1 + BOARD_SIZE) % BOARD_SIZE;
        } else if (direction === "Right") {
          return (column + 1) % BOARD_SIZE;
        }
        return column;
      })();
      return cells[newRow * BOARD_SIZE + newColumn];
    })();
    nextSelectedCell.setIsSelected(true);
  }

  public unselect(): void {
    const cells = this.cells;
    for (const cell of cells) {
      cell.setIsSelected(false);
    }
  }

  public reset(): void {
    this.unselect();
    const cells = this.cells;
    for (const cell of cells) {
      cell.reset();
    }
  }
}
