import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Year, default as db } from './helpers';

@Component({
    selector: 'app-year',
    template: `
        <h2>{{ show?.year }}</h2>

        <app-publication
            *ngFor="let publication of show?.publications"
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
    private db = db;
    constructor(private http: HttpClient) { }
    ngOnInit() {
        if (!this.magazine || !this.year)
            return;

        db.init(this.http).then(() => {
            this.show = this.db
                ?.getMagazine(this.magazine!)
                ?.getYear(this.year!);
        })
    }

    @Input() magazine: string | undefined = undefined;
    @Input() year: string | undefined = undefined;

    protected show: Year | undefined = undefined;
}
