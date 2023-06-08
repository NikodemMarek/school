import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Year, MagazinesService } from './service.magazines';

@Component({
    selector: 'app-year',
    template: `
        <button (click)="back.emit()">back</button>

        <h2>{{ show?.year }}</h2>

        <div id="publications">
            <app-publication
                *ngFor="let publication of show?.publications"
                [publication]="publication"
            />
        </div>
    `,
    styles: [`
        #publications {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            grid-gap: 1rem;
        }
    `],
    providers: [
        MagazinesService,
    ],
})
export class AppYear {
    constructor(private db: MagazinesService) { }
    ngOnInit() {
        if (!this.magazine || !this.year)
            return;

        this.db.init().then(() => {
            if (!this.magazine || !this.year)
                return;

            if (this.year === 'all')
                this.show = this.db
                    ?.getMagazine(this.magazine!)
                    ?.getYears()
                    .reduce((acc, year) => {
                        const publications = year.publications;

                        if (acc.publications.some(p => publications.includes(p)))
                            return acc;

                        acc.publications = acc.publications.concat(publications);
                        return acc;
                    }, new Year('all', []));
            else
                this.show = this.db
                    ?.getMagazine(this.magazine!)
                    ?.getYear(this.year!);
        })
    }

    @Input() magazine: string | undefined = undefined;
    @Input() year: string | undefined = undefined;
    protected show: Year | undefined = undefined;

    @Output() back = new EventEmitter<void>()
}
