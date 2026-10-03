import { Body } from "./body";
import { EditModes } from "./editMode";
import { Board } from "./board";
import { NumberButtons } from "./numberButtons";
import { setKeyboardEvents } from "./keyboard";
import { Highlight } from "./highlight";
import { SudokuValue, EMPTY_VALUE } from "./sudokuValue";

function main(): void {
  // instantiate elements
  const body = new Body();
  const editModes = new EditModes(body);
  const board = new Board(body, [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 6, 0, 4, 0],
    [0, 0, 0, 0, 2, 0, 1, 0, 3],
    [0, 0, 0, 0, 0, 9, 0, 6, 0],
    [0, 0, 3, 0, 0, 0, 0, 0, 1],
    [9, 5, 0, 0, 6, 4, 0, 3, 7],
    [0, 1, 0, 0, 0, 0, 0, 7, 5],
    [6, 0, 8, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 2, 0, 0, 0],
  ]);
  const numberButtons = new NumberButtons(body);
  const highlight = new Highlight();
  // register event handlers
  highlight.setOnUpdateHandler((highlightedValue: SudokuValue) => {
    numberButtons.highlight(highlightedValue);
    board.highlight(highlightedValue);
  });
  body.setOnClickHandler(() => {
    board.unselect();
    highlight.setValue(EMPTY_VALUE);
  });
  board.setOnClickHandler((cellValue: SudokuValue) => {
    board.unselect();
    highlight.setValue(cellValue);
  });
  numberButtons.setOnClickHandler((clickedButtonValue: SudokuValue) => {
    board.validateAndUpdateValue(editModes.getCurrentMode(), clickedButtonValue);
    highlight.setValue(clickedButtonValue);
  });
  document.addEventListener("keydown", (keyboardEvent: KeyboardEvent) => {
    const key: string = keyboardEvent.key;
    setKeyboardEvents(key, board, editModes, numberButtons);
  });
}

window.addEventListener("load", () => {
  main();
});
