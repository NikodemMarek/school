import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  template: `
    <h1>game settings</h1>

    <app-settings-dimensions (onConfirm)="start($event.x, $event.y, $event.points)"></app-settings-dimensions>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 10px;
        padding: 10px;
      }

      :host app-settings-dimensions {
        width: 400px;
      }
    `,
  ],
})

export class SettingsComponent {
  constructor(private router: Router) {}

  start = (x: number, y: number, points: number) =>
    this.router.navigate(['/game'], {
      queryParams: { x, y, points },
    });
}
