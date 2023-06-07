import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Magazine, MagazinesDB } from './helpers';

@Component({
    selector: 'app-main-noroutes',
    template: `
        <app-magazines
            *ngIf="db && !selectedMagazine"
            [db]="db"
            (onMagazineClick)="onMagazineClick($event)"
        />

        <app-magazine
            *ngIf="selectedMagazine"
            [magazine]="selectedMagazine"
        />
    `,
    styles: [`
    `],
})
export class AppMainNoroutes {
    protected db: MagazinesDB

	constructor(private http: HttpClient) {
        this.db = new MagazinesDB(this.http);
    }

    protected selectedMagazine: Magazine | null = null
    protected onMagazineClick = (magazine: Magazine) =>
        this.selectedMagazine = magazine;
}
