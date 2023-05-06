import { Mark } from "./types";

export class Opponent {
  constructor(private size: number) {}

  makeMove = (board: Mark[][], lastMove: { x: number, y: number }): { x: number, y: number } => {
    const moves = this.getMoves(board);

    return moves[Math.floor(Math.random() * moves.length)];
  }

  getMoves = (board: Mark[][]): { x: number, y: number }[] => {
    const moves: { x: number, y: number }[] = [];

    for (let y = 0; y < board.length; y++) {
      const row = board[y];
      for (let x = 0; x < row.length; x++) {
        if (board[y][x] === Mark.None) moves.push({ x, y });
      }
    }

    return moves;
  }
}
