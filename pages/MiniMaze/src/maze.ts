import { Cell, Direction, BoardSize, Position } from "./maze/types";
import { Maker } from "./maze/maker";
import { Player } from "./maze/player";
import { Solver } from "./maze/solver";
import { Drawer } from "./maze/drawer";

export class Maze {
  private boardSize: Readonly<BoardSize>;
  private maker: Maker;
  private player: Player;
  private solver: Solver;
  private drawer: Drawer;
  private start: Readonly<Position>;
  private goal: Readonly<Position>;

  public constructor(size: { width: number; height: number }) {
    const boardSize: BoardSize = decideBoardSize(size);
    const maker = new Maker(boardSize);
    const player = new Player();
    const solver = new Solver();
    const drawer = new Drawer();
    this.boardSize = boardSize;
    this.maker = maker;
    this.player = player;
    this.solver = solver;
    this.drawer = drawer;
    this.start = { x: 0, y: 0 };
    this.goal = { x: boardSize.width - 1, y: boardSize.height - 1 };
  }

  public make(): { isCompleted: boolean } {
    return this.maker.updateBoard();
  }

  public solve(): { isCompleted: boolean } {
    return this.solver.solve(this.boardSize, this.maker.getBoard(), this.start, this.goal);
  }

  public moveCursor(direction: Direction) {
    if (!this.completeMaking()) {
      console.log("Cannot play it until the making process has been completed");
      return;
    }
    if (this.solver.getIsInvoked()) {
      console.log("Solver has been invoked; cursor movements are not allowed");
      return;
    }
    const boardSize: Readonly<BoardSize> = this.boardSize;
    const board: ReadonlyArray<ReadonlyArray<Cell>> = this.maker.getBoard();
    this.player.moveCursor(direction, boardSize, board);
  }

  public draw(ctx: CanvasRenderingContext2D, screenSize: [number, number]) {
    const completeMaking: boolean = this.completeMaking();
    const isSolverInvoked: boolean = this.solver.getIsInvoked();
    const boardSize: BoardSize = this.boardSize;
    const board: ReadonlyArray<ReadonlyArray<Cell>> = this.maker.getBoard();
    const cursor: Position = this.player.getCursor();
    const trajectory: ReadonlyArray<Position> = this.player.getTrajectory();
    this.drawer.draw(
      ctx,
      screenSize,
      completeMaking,
      isSolverInvoked,
      boardSize,
      board,
      cursor,
      trajectory,
      this.start,
      this.goal,
    );
  }

  private completeMaking(): boolean {
    return this.maker.getIsCompleted();
  }
}

function decideBoardSize(size: { width: number; height: number }): BoardSize {
  const width: number = Math.max(1, Math.floor(size.width));
  const height: number = Math.max(1, Math.floor(size.height));
  return {
    width: 2 * width + 1,
    height: 2 * height + 1,
  };
}
