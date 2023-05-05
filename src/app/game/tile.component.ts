import { Component, Input } from '@angular/core';
import { Mark } from '../types';

@Component({
  selector: 'app-game-tile',
  template: `
    <img [src]="image" />
  `,
  styles: [
    `
       :host {
        aspect-ratio: 1;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
        box-sizing: border-box;
      }

      :host img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    `,
  ],
})
export class GameTileComponent {
  @Input() value: Mark = Mark.None;

  get image() {
    switch (this.value) {
      case Mark.X:
        return "/assets/x.png";
      case Mark.O:
        return "/assets/o.png";
      default:
        return "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    }
  }
}
