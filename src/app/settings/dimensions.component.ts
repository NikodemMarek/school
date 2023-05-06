import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-settings-dimensions',
  template: `
    <app-settings-size [name]="'width&nbsp;'" [min]="5" (sizeChange)="x=$event"></app-settings-size>
    <app-settings-size [name]="'height'" [min]="5" (sizeChange)="y=$event"></app-settings-size>

    <app-settings-size [name]="'points'" [min]="0" (sizeChange)="points=$event"></app-settings-size>

    <button id="start" [disabled]="!x || !y || points < 0" type="button" (click)="emitConfirm()">start</button>

    <div class="presets">
      <div *ngFor="let preset of presets">
        <button type="button" (click)="confirm(preset.x, preset.y, preset.points)">
          {{ preset.x }} x {{ preset.y }}
          <br> {{ preset.points < 1? "no limit": preset.points + " points" }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      :host #start {
        margin-top: 10px;
      }
      :host #start:disabled {
        cursor: not-allowed;
        background-color: #BF616A;
        color: black;
      }

      :host button {
        font-size: 20px;

        padding: 10px;
        width: 100%;
        border-radius: 10px;

        outline: none;
        border: none;

        cursor: pointer;
        background-color: #4C566A;
      }
      :host button:hover {
        background-color: #434C5E;
      }

      :host .presets {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;

        margin-top: 40px;
        gap: 10px;
      }
    `,
  ],
})

export class SettingsDimensionsComponent {
  protected presets = [
    { x: 1, y: 10, points: 0 },
    { x: 10, y: 1, points: 0 },
    { x: 5, y: 5, points: 0 },
    { x: 5, y: 10, points: 0 },
    { x: 10, y: 5, points: 0 },
    { x: 10, y: 10, points: 0 },
    { x: 15, y: 15, points: 0 },
  ]

  protected x: number | null = null
  protected y: number | null = null

  protected points: number = 0

  @Output() onConfirm = new EventEmitter();

  emitConfirm = () => this.onConfirm.emit({ x: this.x || 5, y: this.y || 5, points: this.points || 0 })
  confirm = (x: number, y: number, points: number) => {
    this.x = x
    this.y = y
    this.points = points

    this.emitConfirm()
  }
}
