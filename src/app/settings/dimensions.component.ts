import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-settings-dimensions',
  template: `
    <app-settings-size [name]="'x'" (sizeChange)="x=$event"></app-settings-size>
    <app-settings-size [name]="'y'" (sizeChange)="y=$event"></app-settings-size>

    <button *ngIf="x && y" type="button" (click)="emitConfirm()">start</button>

    <div class="presets">
      <div *ngFor="let preset of presets">
        <button type="button" (click)="confirm(preset.x, preset.y)">
          {{ preset.x }} x {{ preset.y }}
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

      :host button {
        font-size: 20px;

        padding: 10px;
        margin-top: 10px;
        width: 100%;
        border-radius: 10px;

        outline: none;
        border: none;

        background-color: lightgray;
      }
      :host button:hover {
        background-color: gray;
      }

      :host .presets {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;

        margin-top: 10px;
        gap: 10px;
      }
    `,
  ],
})

export class SettingsDimensionsComponent {
  protected presets = [
    { x: 1, y: 10 },
    { x: 10, y: 1 },
    { x: 5, y: 5 },
    { x: 5, y: 10 },
    { x: 10, y: 5 },
    { x: 10, y: 10 },
    { x: 15, y: 15 },
  ]

  protected x: number | null = null
  protected y: number | null = null

  @Output() onConfirm = new EventEmitter();

  emitConfirm = () => this.onConfirm.emit({ x: this.x || 5, y: this.y || 5 })
  confirm = (x: number, y: number) => {
    this.x = x
    this.y = y

    this.emitConfirm()
  }
}
