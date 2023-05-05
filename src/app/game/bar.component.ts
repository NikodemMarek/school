import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mark } from '../types';

@Component({
  selector: 'app-game-bar',
  template: `
    <div id="score">
      <div id="x" [style.flex]="score['X'] + 1">
        <img src="/assets/x.png" />
        <span>{{ score['X'] }}</span>
      </div>
      <div id="o" [style.flex]="score['O'] + 1">
        <span>{{ score['O'] }}</span>
        <img src="/assets/o.png" />
      </div>
    </div>

    <button id="restart" (click)="restart()">restart</button>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;

        padding: 1rem;
        width: 100%;
        gap: 1rem;

        font-size: 2rem;

        box-sizing: border-box;

        background-color: #2E3440;
      }

      :host #score {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      :host #score > div {
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0.5rem;
      }

      :host #score > div > img {
        width: 2rem;
        height: 2rem;
      }

      #x {
        flex: 1;
        background-color: #5E81AC;
        border-radius: 50px 0 0 50px;
      }
      #o {
        flex: 1;
        background-color: #88C0D0;
        border-radius: 0 50px 50px 0;
      }

      :host #restart {
        flex: 0;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        background-color: #D08770;
        font-size: 2rem;

        border: none;
        outline: none;
      }
      :host #restart:hover {
        cursor: pointer;
        background-color: #BF616A;
      }
    `,
  ],
})
export class GameBarComponent {
  @Input() score: { [Mark.X]: number, [Mark.O]: number } = { [Mark.X]: 0, [Mark.O]: 0 };

  @Output() restartChange = new EventEmitter<void>();
  restart = () => this.restartChange.emit();
}
