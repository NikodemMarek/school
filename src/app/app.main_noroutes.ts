import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { default as db } from './helpers';

@Component({
    selector: 'app-main-noroutes',
    template: `
        <app-income
            *ngIf="!isSecretIncome"
            (onSecretIncome)="isSecretIncome = true"
        />

        <app-magazines
            *ngIf="isSecretIncome && db && !selectedMagazine && !selectedYear"
            (onMagazineClick)="onMagazineClick($event)"
        />

        <app-magazine
            *ngIf="isSecretIncome && selectedMagazine && !selectedYear"
            [magazine]="selectedMagazine"
            (onYearClick)="onYearClick($event)"
        />

        <app-year
            *ngIf="isSecretIncome && selectedYear"
            [magazine]="selectedMagazine"
            [year]="selectedYear"
        />
    `,
    styles: [`
    `],
})
export class AppMainNoroutes {
    protected isSecretIncome = false;

    protected db = db;
    constructor(private http: HttpClient) { }
    ngOnInit() {
        db.init(this.http)
    }

    protected selectedMagazine: string | undefined = undefined;
    protected onMagazineClick = (magazine: string) =>
        this.selectedMagazine = magazine;

    protected selectedYear: string | undefined = undefined;
    protected onYearClick = (year: string) =>
        this.selectedYear = year;
}
