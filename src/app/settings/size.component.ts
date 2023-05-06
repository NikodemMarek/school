import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-size',
  template: `
    <div id="input" [class.error]="size.invalid && (size.dirty || size.touched)">
      {{ name }} <input type="number" [formControl]="size" (change)="change()">
    </div>

    <div id="error" *ngIf="size.invalid && (size.dirty || size.touched)">
      <div *ngIf="size.errors?.['required']">
        {{ name }} is required
      </div>

      <div *ngIf="size.errors?.['min']">
        {{ name }} must be at least {{ min }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;

        width: 100%;

        box-sizing: border-box;

        margin: 5px 0;
      }

      :host #input {
        display: flex;
        flex-direction: row;
        align-items: center;

        background-color: #4C566A;
        padding: 10px;
        border-radius: 10px;
      }
      :host #input:has(input:focus) {
        background-color: #434C5E;
      }

      .error {
        background-color: #BF616A !important;
      }

      :host #input input {
        margin-left: 10px;
        text-align: center;

        font-size: 20px;

        outline: none;
        border: none;
        background-color: transparent;
      }
      :host #input input:focus {
        outline: none;
        border: none;
      }

      :host #error {
        color: #BF616A;
      }
    `,
  ],
})

export class SettingsSizeComponent {
  @Input() name = 'size';
  @Input() min = 0;

  protected size = new FormControl(0, [Validators.required, Validators.min(this.min)]);
  @Output() sizeChange = new EventEmitter();

  protected change = () => this.sizeChange.emit(this.size.valid? this.size.value : null);

  ngOnInit() {
    this.size = new FormControl(0, [Validators.required, Validators.min(this.min)]);
  }
}
