import { BoardSize, Cell, Position } from "./types";

interface WalkPattern {
  readonly canWalk: (position: Readonly<Position>) => boolean;
  readonly walk: (position: Readonly<Position>) => void;
}

function isClosed(cell: Readonly<Cell>): boolean {
  return "WALL" === cell || "DEADEND" === cell;
}

function isDeadEnd(
  boardSize: Readonly<BoardSize>,
  board: ReadonlyArray<ReadonlyArray<Cell>>,
  start: Readonly<Position>,
  goal: Readonly<Position>,
  position: Readonly<Position>,
): boolean {
  // start / goal are exceptions
  if (start.x === position.x && start.y === position.y) {
    return false;
  }
  if (goal.x === position.x && goal.y === position.y) {
    return false;
  }
  // dead-end should be a part of roads
  if ("ROAD" !== board[position.y][position.x]) {
    return false;
  }
  // find cells which are closed: either WALL or DEADEND
  const isAtLeftBound: boolean = 0 === position.x;
  const isAtRightBound: boolean = boardSize.width - 1 === position.x;
  const isAtBottomBound: boolean = 0 === position.y;
  const isAtTopBound: boolean = boardSize.height - 1 === position.y;
  const criteria: ReadonlyArray<boolean> = [
    isAtLeftBound || isClosed(board[position.y][position.x - 1]),
    isAtRightBound || isClosed(board[position.y][position.x + 1]),
    isAtBottomBound || isClosed(board[position.y - 1][position.x]),
    isAtTopBound || isClosed(board[position.y + 1][position.x]),
  ];
  // dead-end is defined to be a cell whose three edges are closed
  return 3 === criteria.filter(Boolean).length;
}

function findStartingPoint(
  boardSize: Readonly<BoardSize>,
  board: ReadonlyArray<ReadonlyArray<Cell>>,
  start: Readonly<Position>,
  goal: Readonly<Position>,
): Position | null {
  for (let row = 0; row < boardSize.height; row++) {
    for (let column = 0; column < boardSize.width; column++) {
      const position: Readonly<Position> = { x: column, y: row };
      if (isDeadEnd(boardSize, board, start, goal, position)) {
        return position;
      }
    }
  }
  return null;
}

export class Solver {
  private isInvoked: boolean;

  public constructor() {
    this.isInvoked = false;
  }

  public solve(
    boardSize: Readonly<BoardSize>,
    board: ReadonlyArray<Array<Cell>>,
    start: Readonly<Position>,
    goal: Readonly<Position>,
  ): { isCompleted: boolean } {
    this.isInvoked = true;
    const position: Position | null = findStartingPoint(boardSize, board, start, goal);
    if (null === position) {
      return { isCompleted: true };
    }
    board[position.y][position.x] = "DEADEND";
    const walkPatterns: ReadonlyArray<Readonly<WalkPattern>> = this.getWalkPatterns(
      boardSize,
      board,
      start,
      goal,
    );
    randomWalk: for (;;) {
      for (const walkPattern of walkPatterns) {
        if (walkPattern.canWalk(position)) {
          walkPattern.walk(position);
          continue randomWalk;
        }
      }
      break randomWalk;
    }
    return { isCompleted: false };
  }

  public getIsInvoked(): boolean {
    return this.isInvoked;
  }

  private getWalkPatterns(
    boardSize: Readonly<BoardSize>,
    board: ReadonlyArray<Array<Cell>>,
    start: Readonly<Position>,
    goal: Readonly<Position>,
  ): Array<WalkPattern> {
    const directions = [
      {
        dx: -1,
        dy: 0,
        isOutOfBounds: (position: Position) => position.x === 0,
        move: (position: Position) => --position.x,
      },
      {
        dx: 1,
        dy: 0,
        isOutOfBounds: (position: Position) => position.x === boardSize.width - 1,
        move: (position: Position) => ++position.x,
      },
      {
        dx: 0,
        dy: -1,
        isOutOfBounds: (position: Position) => position.y === 0,
        move: (position: Position) => --position.y,
      },
      {
        dx: 0,
        dy: 1,
        isOutOfBounds: (position: Position) => position.y === boardSize.height - 1,
        move: (position: Position) => ++position.y,
      },
    ];
    return directions.map(({ dx, dy, isOutOfBounds, move }) => ({
      canWalk: (position: Position) =>
        !isOutOfBounds(position) &&
        isDeadEnd(boardSize, board, start, goal, { x: position.x + dx, y: position.y + dy }),
      walk: (position: Position) => {
        move(position);
        board[position.y][position.x] = "DEADEND";
      },
    }));
  }
}
