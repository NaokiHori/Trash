import { Cell, BoardSize, Position } from "./types";

interface WalkPattern {
  canWalk: (position: Position) => boolean;
  walk: (position: Position) => void;
}

export class Maker {
  private boardSize: BoardSize;
  private board: Array<Array<Cell>>;
  private isCompleted: boolean;
  private startingPointCandidates: Array<Position>;

  public constructor(boardSize: BoardSize) {
    const board: Array<Array<Cell>> = Array.from({ length: boardSize.height }, () =>
      Array.from<Cell>({ length: boardSize.width }).fill("WALL"),
    );
    const rows = shuffle(getEvenNumbers(boardSize.height));
    const columns = shuffle(getEvenNumbers(boardSize.width));
    const startingPointCandidates = new Array<Position>();
    for (const row of rows) {
      for (const column of columns) {
        startingPointCandidates.push({ x: column, y: row });
      }
    }
    board[startingPointCandidates[0].y][startingPointCandidates[0].x] = "ROAD";
    this.boardSize = { ...boardSize };
    this.board = board;
    this.isCompleted = false;
    this.startingPointCandidates = updateStartingPointCandidates(
      boardSize,
      board,
      startingPointCandidates,
    );
  }

  public updateBoard(): { isCompleted: boolean } {
    const startingPointCandidates: Array<Position> = this.startingPointCandidates;
    const boardSize: BoardSize = this.boardSize;
    const board: ReadonlyArray<Array<Cell>> = this.board;
    const position: Position | null = findStartingPoint(startingPointCandidates, boardSize, board);
    if (null === position) {
      this.isCompleted = true;
      return { isCompleted: true };
    }
    const walkPatterns: Array<WalkPattern> = this.getWalkPatterns();
    randomWalk: for (;;) {
      for (const walkPattern of shuffle(walkPatterns)) {
        if (walkPattern.canWalk(position)) {
          walkPattern.walk(position);
          continue randomWalk;
        }
      }
      break randomWalk;
    }
    this.startingPointCandidates = updateStartingPointCandidates(
      boardSize,
      board,
      startingPointCandidates,
    );
    this.isCompleted = false;
    return { isCompleted: false };
  }

  public getBoard(): Array<Array<Cell>> {
    return this.board;
  }

  public getIsCompleted(): boolean {
    return this.isCompleted;
  }

  private getWalkPatterns(): Array<WalkPattern> {
    const boardSize = this.boardSize;
    const board = this.board;
    return [
      {
        canWalk: (position: Position) => canAdvanceLeft(board, position),
        walk: (position: Position) => {
          board[position.y][--position.x] = "ROAD";
          board[position.y][--position.x] = "ROAD";
        },
      },
      {
        canWalk: (position: Position) => canAdvanceRight(boardSize, board, position),
        walk: (position: Position) => {
          board[position.y][++position.x] = "ROAD";
          board[position.y][++position.x] = "ROAD";
        },
      },
      {
        canWalk: (position: Position) => canAdvanceDown(board, position),
        walk: (position: Position) => {
          board[--position.y][position.x] = "ROAD";
          board[--position.y][position.x] = "ROAD";
        },
      },
      {
        canWalk: (position: Position) => canAdvanceUp(boardSize, board, position),
        walk: (position: Position) => {
          board[++position.y][position.x] = "ROAD";
          board[++position.y][position.x] = "ROAD";
        },
      },
    ];
  }
}

function shuffle<T>(vec: Array<T>) {
  const nitems: number = vec.length;
  for (let i = 0; i < nitems; i++) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [vec[i], vec[j]] = [vec[j], vec[i]];
  }
  return vec;
}

function getEvenNumbers(maxValue: number) {
  return [...Array.from({ length: maxValue }).keys()].filter((n: number) => n % 2 === 0);
}

function findStartingPoint(
  startingPointCandidates: Array<Position>,
  boardSize: BoardSize,
  board: ReadonlyArray<ReadonlyArray<Cell>>,
): Position | null {
  // visit each cell randomly
  for (const point of startingPointCandidates) {
    // find a cell which is a road cell and
    //   there is at least one adjacent wall cell,
    //   so that we can start digging from there
    const cell: Cell = board[point.y][point.x];
    if ("ROAD" !== cell) {
      continue;
    }
    if (
      canAdvanceDown(board, point) ||
      canAdvanceUp(boardSize, board, point) ||
      canAdvanceLeft(board, point) ||
      canAdvanceRight(boardSize, board, point)
    ) {
      return point;
    }
  }
  return null;
}

function canAdvanceDown(board: ReadonlyArray<ReadonlyArray<Cell>>, position: Position): boolean {
  if (0 === position.y) return false;
  if ("ROAD" === board[position.y - 2][position.x]) return false;
  return true;
}

function canAdvanceUp(
  boardSize: BoardSize,
  board: ReadonlyArray<ReadonlyArray<Cell>>,
  position: Position,
): boolean {
  if (boardSize.height - 1 === position.y) return false;
  if ("ROAD" === board[position.y + 2][position.x]) return false;
  return true;
}

function canAdvanceLeft(board: ReadonlyArray<ReadonlyArray<Cell>>, position: Position): boolean {
  if (0 === position.x) return false;
  if ("ROAD" === board[position.y][position.x - 2]) return false;
  return true;
}

function canAdvanceRight(
  boardSize: BoardSize,
  board: ReadonlyArray<ReadonlyArray<Cell>>,
  position: Position,
): boolean {
  if (boardSize.width - 1 === position.x) return false;
  if ("ROAD" === board[position.y][position.x + 2]) return false;
  return true;
}

function updateStartingPointCandidates(
  boardSize: BoardSize,
  board: ReadonlyArray<ReadonlyArray<Cell>>,
  candidates: Array<Position>,
): Array<Position> {
  const newCandidates = candidates.filter(
    (candidate: Position) =>
      canAdvanceDown(board, candidate) ||
      canAdvanceUp(boardSize, board, candidate) ||
      canAdvanceLeft(board, candidate) ||
      canAdvanceRight(boardSize, board, candidate),
  );
  return shuffle(newCandidates);
}
