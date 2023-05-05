import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
    `,
  ],
})
export class AppComponent { }
