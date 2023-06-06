import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Magazine } from './helpers';

@Component({
    selector: 'app-magazine',
    template: `
        <div id="years-select">
            <div
                *ngFor="let year of magazine?.years"
            >
                <input
                    type="checkbox"
                    id="{{ year?.year }}"
                    (click)="onYearClick(year?.year || '')"
                    checked
                />
                <label for="{{ year?.year }}">{{ year?.year }}</label>
            </div>
        </div>

        <div id="years">
            <ng-container *ngFor="let year of magazine?.years">
                <div
                    class="year"
                    *ngIf="showYears.has(year?.year || '')"
                >
                    <h2>{{ year?.year }}</h2>

                    <app-publication
                        *ngFor="let publication of year?.publications"
                        [publication]="publication"
                    />
                </div>
            </ng-container>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        #years-select {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }

        #years {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }
        .year {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `],
})
export class AppMagazine {
    @Input() magazine: Magazine | null = null

    protected showYears = new Set<string>()
    protected onYearClick = (year: string) => {
        if (this.showYears.has(year))
            this.showYears.delete(year)
        else
            this.showYears.add(year)
    }

    protected showAllYears = () =>
        this.magazine?.getYears().forEach(year => this.showYears.add(year.year))
    protected hideAllYears = () =>
        this.magazine?.getYears().forEach(year => this.showYears.delete(year.year))

    ngOnInit() {
        this.showAllYears()
    }
}
