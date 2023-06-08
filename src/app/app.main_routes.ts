import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MagazinesService } from './service.magazines';

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
    providers: [
        MagazinesService,
    ],
})
export class AppMainRoutes {
	constructor(
        private router: Router,
        private db: MagazinesService,
    ) { }
    ngOnInit() {
        this.db.init().then(() => {
            if (this.magazine && !this.db.magazines.map(m => m.name).includes(this.magazine!))
                return this.onBackClick(false);

            if (this.magazine && this.year && !this.db.getMagazine(this.magazine!)!.years.map(y => y.year).includes(this.year!))
                return this.onBackClick(true)
        })
    }

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
