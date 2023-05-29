import { Mark } from "./types";

export class Opponent {
  private nextAttack: { x: number, y: number } | null = null;

  constructor(private size: { x: number, y: number }) {}

  makeMove = (board: Mark[][], lastMove: { x: number, y: number }): { x: number, y: number } => {
    const moves = this.getMoves(board);

    const getRandomMove = () => moves[Math.floor(Math.random() * moves.length)];

    const saveMoves = this.shouldIBeAlamed(board, lastMove);
    if (saveMoves.length > 0)
      return saveMoves[0]

    if (this.nextAttack == lastMove)
      this.nextAttack = null

    if (!this.nextAttack) {
      console.log('0')
      const thisAttack = getRandomMove()
      this.nextAttack = this.getNextAttack(board, thisAttack)
      console.log('0', thisAttack)
      return thisAttack
    } else {
      console.log('1')
      const thisAttack = this.nextAttack
      this.nextAttack = this.getNextAttack(board, thisAttack)
      console.log('1', thisAttack)
      return thisAttack
    }
  }

  private getMoves = (board: Mark[][]): { x: number, y: number }[] => {
    const moves: { x: number, y: number }[] = [];

    for (let y = 0; y < board.length; y++) {
      const row = board[y];
      for (let x = 0; x < row.length; x++) {
        if (board[y][x] === Mark.None) moves.push({ x, y });
      }
    }

    return moves;
  }

  private tilesWithMarkAound = (board: Mark[][], around: { x: number, y: number }, mark: Mark): { x: number, y: number }[] => {
    const { x, y } = around;

    const possibilities = [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
    ];

    const tilesAround: { x: number, y: number }[] = [];
    for (const possibility of possibilities) {
      const newX = x + possibility.x;
      const newY = y + possibility.y;

      if (newX >= 0 && newX < this.size.x && newY >= 0 && newY < this.size.y)
        if (board[newY][newX] === mark)
          tilesAround.push({ x: newX, y: newY });
    }

    return tilesAround;
  }

  private getMovesAround = (board: Mark[][], origin: { x: number, y: number }): { x: number, y: number }[] =>
    this.tilesWithMarkAound(board, origin, Mark.None);

  private getMyMarksAround = (board: Mark[][], origin: { x: number, y: number }): { x: number, y: number }[] =>
    this.tilesWithMarkAound(board, origin, Mark.X);

  private getOppositeMoves = (moves: { x: number, y: number }[], origin: { x: number, y: number }): { x: number, y: number }[] =>
    moves.map(({ x, y }) => ({
      x: 2 * origin.x - x,
      y: 2 * origin.y - y,
    }))
  private getOppositeFreeMoves = (board: Mark[][], origin: { x: number, y: number }): { x: number, y: number }[] => {
    // console.log('or', origin)

    const rel = this.getMovesAround(board, origin)
    // console.log('rel', rel)

    const opp = this.getOppositeMoves(rel, origin)
    // console.log('opp', opp)
    const filt = opp.filter(({ x, y }) => board[y]?.[x] === Mark.None)
    // console.log('filt', filt)
    return filt
  }

  private getNextAttack = (board: Mark[][], nextAttack: { x: number, y: number }): { x: number, y: number } | null => {
    const myTilesAround = this.getMyMarksAround(board, nextAttack)

    if (myTilesAround.length <= 0) {
      // console.log('a')
      const movesAround = this.getMovesAround(board, nextAttack)

      if (movesAround.length <= 0) {
        // console.log('b')
        return null
      } else {
        // console.log('c')
        return movesAround[0]
      }
    } else {
      // console.log('d')
      const freeOpposite = this.getOppositeFreeMoves(board, nextAttack)

      if (freeOpposite.length <= 0) {
        // console.log('e')
        const movesAround = this.getMovesAround(board, nextAttack)

        if (movesAround.length <= 0) {
          // console.log('f')
          return null
        } else {
          // console.log('g')
          return movesAround[0]
        }
      } else {
        // console.log('h')
        return freeOpposite[0]
      }
    }
  }

  private shouldIBeAlamed = (board: Mark[][], lastMove: { x: number, y: number }): { x: number, y: number }[] => {
    const { x, y } = lastMove;

    const danger = [
      [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
      [
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ],
      [
        { x: -1, y: 1 },
        { x: -2, y: 2 },
      ],
      [
        { x: -1, y: 0 },
        { x: -2, y: 0 },
      ],
      [
        { x: -1, y: -1 },
        { x: -2, y: -2 },
      ],
      [
        { x: 0, y: -1 },
        { x: 0, y: -2 },
      ],
      [
        { x: 1, y: -1 },
        { x: 2, y: -2 },
      ],
      [
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
    ];

    const available: { x: number, y: number }[] = [];
    for (const direction of danger) {
      if (
        board[y + direction[0].y]?.[x + direction[0].x] === Mark.O
        && board[y + direction[1].y]?.[x + direction[1].x] === Mark.O
      ) {
        const front = {
          x: lastMove.x - direction[0].x,
          y: lastMove.y - direction[0].y,
        }
        const end = {
          x: lastMove.x + direction[0].x * 3,
          y: lastMove.y + direction[0].y * 3,
        }

        if (front.x >= 0 && front.x < this.size.x && front.y >= 0 && front.y < this.size.y && board[front.y][front.x] === Mark.None)
          available.push(front)
        if (end.x >= 0 && end.x < this.size.x && end.y >= 0 && end.y < this.size.y && board[end.y][end.x] === Mark.None)
          available.push(end)
      }
    }

    return available
  }
}
