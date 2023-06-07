import { Component, Input } from '@angular/core';

import { Year } from './helpers';

@Component({
    selector: 'app-year',
    template: `
        <h2>{{ year?.year }}</h2>

        <app-publication
            *ngFor="let publication of year?.publications"
            [publication]="publication"
        />
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `],
})
export class AppYear {
    @Input() year: Year | null = null
}
