import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-size',
  template: `
    <div id="input" [class.error]="size.invalid && (size.dirty || size.touched)">
      {{ name }}: <input type="number" [formControl]="size" (change)="change()">
    </div>

    <div id="error" *ngIf="size.invalid && (size.dirty || size.touched)">
      <div *ngIf="size.errors?.['required']">
        size {{ name }} is required
      </div>

      <div *ngIf="size.errors?.['min']">
        size {{ name }} must be at least 5
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;

        box-sizing: border-box;
      }

      :host #input {
        display: flex;
        flex-direction: row;
        align-items: center;

        border-bottom: 1px solid darkgray;
      }
      :host #input:has(input:focus) {
        border-bottom: 2px solid black;
      }

      .error {
        border-bottom: 2px solid red !important;
      }

      :host #input input {
        margin-left: 10px;
        text-align: center;

        font-size: 20px;

        outline: none;
        border: none;
        background-color: none;
      }
      :host #input input:focus {
        outline: none;
        border: none;
      }

      :host #error {
        color: red;
      }
    `,
  ],
})

export class SettingsSizeComponent {
  @Input() name = 'size';

  protected size = new FormControl(0, [Validators.required, Validators.min(5)]);
  @Output() sizeChange = new EventEmitter();

  protected change = () => this.sizeChange.emit(this.size.valid? this.size.value : null);
}
