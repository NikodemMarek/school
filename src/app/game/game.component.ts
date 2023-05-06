import { Component, Input } from '@angular/core';
import { Opponent } from '../opponentai';
import { Mark } from '../types';

@Component({
  selector: 'app-game',
  template: `
    <app-game-bar [score]="score"></app-game-bar>

    <div id="main">
      <app-game-board [board]="board" (setMarkEvent)="makeMove($event.x, $event.y)"></app-game-board>
      <div class="overlay" *ngIf="gameOver">
        {{ ["draw", "you won", "you lost"][won] }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;

        width: 100%;
        height: 100%;

        box-sizing: border-box;
      }

      :host #main {
        position: relative;

        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }

      :host #main app-game-board {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
      }

      :host #main .overlay {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        font-size: 50px;
        color: #D8DEE9;

        z-index: 1;
      }
    `,
  ],
})
export class GameComponent {
  protected gameOver: boolean = false;
  protected won: 0 | 1 | 2 = 0;

  @Input('x') x: number = 5;
  @Input('y') y: number = 5;

  protected board: Array<Array<Mark>> = []

  private ai: Opponent = new Opponent(this.x);

  ngOnInit() {
    this.x = parseInt(this.x as any, 10);
    this.y = parseInt(this.y as any, 10);

    if (
      !this.x || !this.y
      || this.x < 1 || this.y < 1
      || this.x < 5 && this.y < 5
    ) {
      this.x = 5;
      this.y = 5;
    }

    if (!this.pointsLimit || this.pointsLimit < 0) this.pointsLimit = 0;

    this.board = JSON.parse(JSON.stringify(Array(this.y).fill(Array(this.x).fill(Mark.None))))
  }

  private nextMark: Mark = Mark.O;
  public makeMove = (x: number, y: number) => {
    this.setMark(x, y);

    if (this.gameOver) return;

    const move = this.ai.makeMove(this.board, { x, y });
    this.setMark(move.x, move.y);
  }
  protected setMark = (x: number, y: number) => {
    if (this.board[y][x] !== Mark.None) return;

    this.board[y][x] = this.nextMark;

    const aligned = this.getAligned(x, y);
    aligned.flat().forEach(({ x, y }) => this.board[y][x] = this.nextMark === Mark.X ? Mark.X_USED : Mark.O_USED);
    aligned.forEach(line => this.addScoreToCurrent(line.length));

    if (this.pointsLimit > 0) {
      if (this.score[this.nextMark === Mark.X ? Mark.X : Mark.O] >= this.pointsLimit) {
        this.gameOver = true;
        this.won = this.nextMark === Mark.O? 1: 2;
      }
    } else {
      if (!this.board.flat().some(mark => mark === Mark.None)) {
        this.gameOver = true;
        this.won = this.score[Mark.X] === this.score[Mark.O] ? 0 : this.score[Mark.X] > this.score[Mark.O] ? 2 : 1;
      }
    }

    this.nextMark = this.nextMark === Mark.X ? Mark.O : Mark.X;
  }

  @Input('points') pointsLimit: number = 0;

  protected score = { [Mark.X]: 0, [Mark.O]: 0 };
  private addScoreToCurrent = (lineLength: number) =>
    this.score[this.nextMark === Mark.X ? Mark.X : Mark.O] += lineLength - 4;

  private getAligned = (x: number, y: number): { x: number, y: number }[][] => {
    const mark = this.board[y][x];

    if (mark === Mark.None) return [];

    return [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
    ].filter(direction =>
      this.board[y + direction.y] && this.board[y + direction.y][x + direction.x] === mark
      || this.board[y - direction.y] && this.board[y - direction.y][x - direction.x] === mark
    )
    .reduce((acc: { x: number, y: number }[][], direction) => {
      const aligned = []

      let i = 1

      while (true) {
        const next = {
          x: x + direction.x * i,
          y: y + direction.y * i,
        }
        if (this.board[next.y]?.[next.x] !== mark) break;

        aligned.push(next)

        i ++
      }

      i = 1

      while (true) {
        const next = {
          x: x - direction.x * i,
          y: y - direction.y * i,
        }
        if (this.board[next.y]?.[next.x] !== mark) break;

        aligned.push(next)

        i ++
      }

      if (aligned.length > 3) {
        aligned.push({ x, y })
        acc.push(aligned)
      }

      return acc
    }, [])
  }
}
