import { Component, EventEmitter, Output } from '@angular/core';

import { Magazine, MagazinesService } from './service.magazines';

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
    providers: [
        MagazinesService,
    ],
})
export class AppMagazines {
    constructor(private db: MagazinesService) { }
    ngOnInit() {
        const order = [
            'Atari_Age', 'Komputer',
            'Atari_club', 'Moje_Atari',
            'Avax', 'POKE',
            'Bajtek', 'STEfan',
            'Desktop_Info', 'Swiat_Atari',
            'IKS',
        ]

        this.db.init().then(() => {
            this.show = this.db
                .magazines
                .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
        })
    }

    protected show: Magazine[] | undefined = undefined;

    @Output() onMagazineClick = new EventEmitter<string>()
}
