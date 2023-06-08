import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { default as db } from './helpers';

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
                *ngIf="db && !selectedMagazine && !selectedYear"
                (onMagazineClick)="onMagazineClick($event)"
            />

            <app-magazine
                *ngIf="selectedMagazine && !selectedYear"
                [magazine]="selectedMagazine"
                (onYearClick)="onYearClick($event)"
            />

            <app-year
                *ngIf="selectedYear"
                [magazine]="selectedMagazine"
                [year]="selectedYear"
            />
        </ng-container>
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
