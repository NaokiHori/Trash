import { EditModes } from "./editMode";
import { NumberButtons } from "./numberButtons";
import { EMPTY_VALUE, isSudokuValue } from "./sudokuValue";
import { Board } from "./board";

const ACTION_MAP: Record<string, (board: Board, editModes: EditModes) => void> = {
  i: (_, editModes) => {
    editModes.changeTo("Init");
  },
  I: (_, editModes) => {
    editModes.changeTo("Init");
  },
  n: (_, editModes) => {
    editModes.changeTo("Normal");
  },
  N: (_, editModes) => {
    editModes.changeTo("Normal");
  },
  m: (_, editModes) => {
    editModes.changeTo("Memo");
  },
  M: (_, editModes) => {
    editModes.changeTo("Memo");
  },
  ArrowDown: (board) => {
    board.updateSelectedCell("Down");
  },
  j: (board) => {
    board.updateSelectedCell("Down");
  },
  ArrowUp: (board) => {
    board.updateSelectedCell("Up");
  },
  k: (board) => {
    board.updateSelectedCell("Up");
  },
  ArrowLeft: (board) => {
    board.updateSelectedCell("Left");
  },
  h: (board) => {
    board.updateSelectedCell("Left");
  },
  ArrowRight: (board) => {
    board.updateSelectedCell("Right");
  },
  l: (board) => {
    board.updateSelectedCell("Right");
  },
};

const CLEAR_KEYS = new Set([" ", "Backspace", "Delete"]);

export function setKeyboardEvents(
  key: string,
  board: Board,
  editModes: EditModes,
  numberButtons: NumberButtons,
): void {
  const value = Number(key);
  if (isSudokuValue(value)) {
    numberButtons.select(value);
    return;
  }
  if (CLEAR_KEYS.has(key)) {
    numberButtons.select(EMPTY_VALUE);
    return;
  }
  if (key === "r" || key === "R") {
    if (editModes.getCurrentMode() === "Init") {
      board.reset();
    }
    return;
  }
  ACTION_MAP[key](board, editModes);
}
