import { Mark } from "./types";

export class Opponent {
  private attackMap: { x: number, y: number }[] | null = null;

  constructor(private size: { x: number, y: number }) {}

  makeMove = (board: Mark[][], lastMove: { x: number, y: number }): { x: number, y: number } => {
    const moves = this.getMoves(board);

    const getRandomMove = () => moves[Math.floor(Math.random() * moves.length)];

    if (!this.attackMap) {
      const bestPoints = this.getBestPoints(board)
      this.attackMap = bestPoints[Math.floor(Math.random() * bestPoints.length)]
    }
    if (this.attackMap.some(({ x, y }) => x === lastMove.x && y === lastMove.y)) {
      const bestPoints = this.getBestPoints(board)
      this.attackMap = bestPoints[Math.floor(Math.random() * bestPoints.length)]
    }

    const saveMoves = this.shouldIBeAlamed(board, lastMove);
    if (saveMoves.length > 0)
      return saveMoves[0]


    return this.attackMap.find(({ x, y }) => board[y][x] === Mark.None) || getRandomMove()
  }

  private getBestPoints = (board: Mark[][]) => {
    const freeCombinations = [
      [
        { x: -2, y: 0 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      [
        { x: 0, y: -2 },
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ],
      [
        { x: -2, y: -2 },
        { x: -1, y: -1 },
        { x: 1, y: 1 },
        { x: 2, y: 2 },
      ],
      [
        { x: -2, y: 2 },
        { x: -1, y: 1 },
        { x: 1, y: -1 },
        { x: 2, y: -2 },
      ],
    ]

    const pointsToCheck: { x: number, y: number }[] = []
    for (let y = 0; y < board.length; y++) {
      const row = board[y];
      for (let x = 0; x < row.length; x++) {
        if (board[y][x] === Mark.None || board[y][x] === Mark.X)
          pointsToCheck.push({ x, y })
      }
    }

    const bests = pointsToCheck.map(({ x, y }) => {
       const combinations = freeCombinations.filter(([a, b, c, d]) =>
          (board[y + a.y]?.[x + a.x] === Mark.X || board[y + a.y]?.[x + a.x] === Mark.None)
          && (board[y + b.y]?.[x + b.x] === Mark.X || board[y + b.y]?.[x + b.x] === Mark.None)
          && (board[y + c.y]?.[x + c.x] === Mark.X || board[y + c.y]?.[x + c.x] === Mark.None)
          && (board[y + d.y]?.[x + d.x] === Mark.X || board[y + d.y]?.[x + d.x] === Mark.None)
      )

      return combinations.map(([a, b, c, d]) => {
        return [
          {
            x: x + a.x,
            y: y + a.y,
          },
          {
            x: x + b.x,
            y: y + b.y,
          },
          { x, y },
          {
            x: x + c.x,
            y: y + c.y,
          },
          {
            x: x + d.x,
            y: y + d.y,
          },
        ]
      })
    })

    return bests.flat()
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
