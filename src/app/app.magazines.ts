import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { default as db, Magazine } from './helpers';

@Component({
    selector: 'app-magazines',
    template: `
        <div
            class="magazine"
            *ngFor="let magazine of show"
            (click)="onMagazineClick.emit(magazine?.name)"
        >
            <img
                [src]="magazine.thumbnail" 
                [alt]="magazine.name"
            />
        </div>
    `,
    styles: [`
        :host {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 1rem;
        }

        .magazine {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
        }
    `],
})
export class AppMagazines {
    protected db = db;
    constructor(private http: HttpClient) { }
    ngOnInit() {
        const order = [
            'Atari_Age', 'Komputer',
            'Atari_club', 'Moje_Atari',
            'Avax', 'POKE',
            'Bajtek', 'STEfan',
            'Desktop_Info', 'Swiat_Atari',
            'IKS',
        ]

        db.init(this.http).then(() => {
            this.show = this.db
                .get()
                .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))

                console.log(this.show)
        })
    }

    protected show: Magazine[] | undefined = undefined;

    @Output() onMagazineClick = new EventEmitter<string>()
}
