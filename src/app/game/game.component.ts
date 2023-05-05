import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-game',
  template: `
    <app-game-board [size]="{ x, y }"></app-game-board>
  `,
  styles: [
    `
      :host {
        padding: 1rem;

        display: flex;
        justify-content: center;

        width: 100%;
        height: 100%;
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
}
