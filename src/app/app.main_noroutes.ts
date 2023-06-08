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
            />

            <app-year
                *ngIf="selectedMagazine && selectedYear"
                [magazine]="selectedMagazine"
                [year]="selectedYear"
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
}
