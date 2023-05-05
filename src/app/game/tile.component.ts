import { Component, Input } from '@angular/core';
import { Mark } from '../types';

@Component({
  selector: 'app-game-tile',
  template: `
    {{ value }}
  `,
  styles: [
    `
       :host {
        aspect-ratio: 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        box-sizing: border-box;
      }
    `,
  ],
})
export class GameTileComponent {
  @Input() value: Mark = Mark.None;
}
