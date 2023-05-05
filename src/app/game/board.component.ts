import { Mark } from './../types';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game-board',
  template: `
    <table>
      <tr *ngFor="let row of board; let y = index">
        <td *ngFor="let mark of row; let x = index">
          <app-game-tile
            [value]="mark"
            (click)="setMark(x, y)"
            ></app-game-tile>
        </td>
      </tr>
    </table>
  `,
  styles: [`
    :host {
      overflow: auto;
      padding: 1rem;
      box-sizing: border-box;
    }

    :host table {
      border-collapse: collapse;
      table-layout: fixed;
    }

    :host table td {
      border: 1px solid black;
      aspect-ratio: 1;
      width: 100px;
    }
  `],
})
export class GameBoardComponent {
  private _size: { x: number; y: number } = { x: 5, y: 5 };
  @Input()
  set size(value: { x: number; y: number }) {
    this._size = value;
    this.board = this.newBoard(value.x, value.y);
  }

  protected board: Array<Array<Mark>>

  private nextMark: Mark = Mark.O;

  constructor() {
    this.board = this.newBoard(5, 5);
    this.size = { x: 5, y: 5 }
  }

  newBoard = (x: number, y: number) => JSON.parse(JSON.stringify(Array(y).fill(Array(x).fill(Mark.None))))

  setMark = (x: number, y: number) => {
    if (this.board[y][x] !== Mark.None) return;

    this.board[y][x] = this.nextMark;

    this.nextMark = this.nextMark === Mark.X ? Mark.O : Mark.X;
  }
}
