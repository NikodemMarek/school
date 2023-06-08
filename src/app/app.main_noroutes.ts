import { Component } from '@angular/core';

import { MagazinesService } from './service.magazines';

@Component({
    selector: 'app-main-noroutes',
    template: `
        <app-clock />

        <app-income
            *ngIf="!isSecretIncome"
            (onSecretIncome)="isSecretIncome = true"
        />

        <ng-container *ngIf="isSecretIncome">
            <app-magazines
                *ngIf="!selectedMagazine && !selectedYear"
                (onMagazineClick)="onMagazineClick($event)"
            />

            <app-magazine
                *ngIf="selectedMagazine && !selectedYear"
                [magazine]="selectedMagazine"
                (onYearClick)="onYearClick($event)"
                (back)="onBackClick(false)"
            />

            <app-year
                *ngIf="selectedMagazine && selectedYear"
                [magazine]="selectedMagazine"
                [year]="selectedYear"
                (back)="onBackClick(true)"
            />
        </ng-container>
    `,
    providers: [
        MagazinesService,
    ],
})
export class AppMainNoroutes {
    protected isSecretIncome = false;

    constructor(private db: MagazinesService) { }
    ngOnInit() {
        this.db.init();
    }

    protected selectedMagazine: string | undefined = undefined;
    protected onMagazineClick = (magazine: string) =>
        this.selectedMagazine = magazine;

    protected selectedYear: string | undefined = undefined;
    protected onYearClick = (year: string) =>
        this.selectedYear = year;

    protected onBackClick = (toYears: boolean) => {
        if (toYears)
            this.selectedYear = undefined;
        else
            this.selectedMagazine = undefined;
    }
}
