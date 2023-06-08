import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-main-routes',
    template: `
        <app-clock />

        <app-magazines
            *ngIf="!magazine && !year"
            (onMagazineClick)="onMagazineClick($event)"
        />

        <app-magazine
            *ngIf="magazine && !year"
            [magazine]="magazine"
            (onYearClick)="onYearClick($event)"
            (back)="onBackClick(false)"
        />

        <app-year
            *ngIf="magazine && year"
            [magazine]="magazine"
            [year]="year"
            (back)="onBackClick(true)"
        />
    `,
})
export class AppMainRoutes {
	constructor(private router: Router) { }

    @Input() magazine: string | undefined = undefined;
    @Input() year: string | undefined = undefined;

    protected selectedMagazine: string | undefined = undefined;
    protected onMagazineClick = (magazine: string | undefined) =>
        this.router.navigate([magazine]);

    protected selectedYear: string | undefined = undefined;
    protected onYearClick = (year: string) =>
        this.router.navigate([this.magazine, year]);

    protected onBackClick = (toYears: boolean) => {
        if (toYears)
            this.router.navigate([this.magazine]);
        else
            this.router.navigate(['/']);
    }
}
