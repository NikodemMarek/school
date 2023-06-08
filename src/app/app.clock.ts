import { Component } from '@angular/core';

@Component({
    selector: 'app-clock',
    template: `
        {{ time | date:'dd-MM-yyyy HH:mm:ss' }}&nbsp;&nbsp;
    `,
    styles: [`
        :host {
            display: block;
            width: 100%;
            margin-bottom: 10px;
            text-align: right;
        }
    `],
})
export class AppClock {
    protected time = new Date();

    constructor() {
        setInterval(() => this.time = new Date(), 1000);
    }
}
