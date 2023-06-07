import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { default as db } from './helpers';
import { Magazine } from './helpers';

@Component({
    selector: 'app-magazine',
    template: `
        <button
            *ngFor="let year of show?.years"
            (click)="onYearClick.emit(year?.year || '')"
        >
            {{ year?.year }}
        </button>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `],
})
export class AppMagazine {
    private db = db;
    constructor(private http: HttpClient) { }
    ngOnInit() {
        db.init(this.http).then(() => {
            if (!this.magazine)
                return;

            this.show = this.db
                ?.getMagazine(this.magazine!)
        })
    }

    @Input() magazine: string | undefined = undefined;
    protected show: Magazine | undefined = undefined;

    @Output() onYearClick = new EventEmitter<string>()
}
