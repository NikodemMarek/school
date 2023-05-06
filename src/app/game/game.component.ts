import { Component, Input } from '@angular/core';
import { Mark } from '../types';

@Component({
  selector: 'app-game',
  template: `
    <app-game-bar [score]="score" (restartChange)="restart()"></app-game-bar>

    <app-game-board [board]="board" (setMarkEvent)="setMark($event.x, $event.y)"></app-game-board>
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
    `,
  ],
})
export class GameComponent {
  @Input('x') x: number = 5;
  @Input('y') y: number = 5;

  protected board: Array<Array<Mark>> = []

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

    this.board = JSON.parse(JSON.stringify(Array(this.y).fill(Array(this.x).fill(Mark.None))))
  }

  protected restart = () => location.reload();

  private nextMark: Mark = Mark.O;
  protected setMark = (x: number, y: number) => {
    if (this.board[y][x] !== Mark.None) return;

    this.board[y][x] = this.nextMark;

    const aligned = this.getAligned(x, y);
    aligned.flat().forEach(({ x, y }) => this.board[y][x] = this.nextMark === Mark.X ? Mark.X_USED : Mark.O_USED);
    aligned.forEach(line => this.addScoreToCurrent(line.length));

    this.nextMark = this.nextMark === Mark.X ? Mark.O : Mark.X;
  }

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
