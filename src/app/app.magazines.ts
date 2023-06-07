import { Component, EventEmitter, Output } from '@angular/core';

import { default as db } from './helpers';

@Component({
    selector: 'app-magazines',
    template: `
        <div
            class="magazine"
            *ngFor="let magazine of db?.get()"
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

    @Output() onMagazineClick = new EventEmitter<string>()
}
