import { Mark } from './../types';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

      width: 100%;
      display: flex;
      justify-content: center;

      background-color: #3B4252;
    }

    :host table {
      border-collapse: collapse;
      table-layout: fixed;
    }

    :host table td {
      aspect-ratio: 1;
      width: 100px;
    }
  `],
})
export class GameBoardComponent {
  @Input() board: Array<Array<Mark>> = [];

  @Output() setMarkEvent = new EventEmitter<{ x: number, y: number }>();
  setMark = (x: number, y: number) => this.setMarkEvent.emit({ x, y });
}
