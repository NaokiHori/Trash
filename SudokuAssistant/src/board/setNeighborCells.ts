import { Cell } from "./cell";
import { Position } from "./position";
import { BOARD_SIZE, BASE_SIZE } from "./param";

function getSameRowCells(position: Position, cells: Array<Cell>): Array<Cell> {
  const neighborCells = new Array<Cell>();
  const row: number = position.row;
  for (let column = 0; column < BOARD_SIZE; column += 1) {
    if (column === position.column) {
      continue;
    }
    neighborCells.push(cells[row * BOARD_SIZE + column]);
  }
  return neighborCells;
}

function getSameColumnCells(position: Position, cells: Array<Cell>): Array<Cell> {
  const neighborCells = new Array<Cell>();
  const column: number = position.column;
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    if (row === position.row) {
      continue;
    }
    neighborCells.push(cells[row * BOARD_SIZE + column]);
  }
  return neighborCells;
}

function getSameBlockCells(position: Position, cells: Array<Cell>): Array<Cell> {
  const neighborCells = new Array<Cell>();
  const blockRow: number = Math.floor(position.row / BASE_SIZE);
  const blockColumn: number = Math.floor(position.column / BASE_SIZE);
  for (let row = BASE_SIZE * blockRow; row < BASE_SIZE * (blockRow + 1); row += 1) {
    for (
      let column = BASE_SIZE * blockColumn;
      column < BASE_SIZE * (blockColumn + 1);
      column += 1
    ) {
      if (position.row === row && position.column === column) {
        continue;
      }
      neighborCells.push(cells[row * BOARD_SIZE + column]);
    }
  }
  return neighborCells;
}

export function setNeighborCells(cell: Cell, cells: Array<Cell>): void {
  const position: Position = cell.getPosition();
  cell.neighborCells = {
    sameRow: getSameRowCells(position, cells),
    sameColumn: getSameColumnCells(position, cells),
    sameBlock: getSameBlockCells(position, cells),
  };
}
