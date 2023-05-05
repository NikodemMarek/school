import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Mark } from '../types';

@Component({
  selector: 'app-game',
  template: `
    <app-game-bar [score]="score" (restartChange)="restart()"></app-game-bar>

    <app-game-board [size]="{ x, y }"></app-game-board>
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
  }

  score = { [Mark.X]: 0, [Mark.O]: 0 };

  restart = () => location.reload();
}
