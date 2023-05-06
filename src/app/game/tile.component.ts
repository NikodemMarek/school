import { Component, Input } from '@angular/core';
import { Mark } from '../types';

@Component({
  selector: 'app-game-tile',
  template: `
    <img [src]="image" [ngClass]="class"/>
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

      .x {
        background-color: #5E81AC;
      }
      .x_used {
        background-color: #BF616A;
      }

      .o {
        background-color: #88C0D0;
      }
      .o_used {
        background-color: #A3BE8C;
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
      case Mark.X_USED:
        return "/assets/x.png";
      case Mark.O_USED:
        return "/assets/o.png";
      default:
        return "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    }
  }

  get class() {
    switch (this.value) {
      case Mark.X:
        return {
          x: true,
        }
      case Mark.O:
        return {
          o: true,
        }
      case Mark.X_USED:
        return {
          x_used: true,
        }
      case Mark.O_USED:
        return {
          o_used: true,
        }
      default:
        return {}
    }
  }
}
