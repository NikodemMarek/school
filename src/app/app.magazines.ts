import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Magazine, MagazinesDB } from './helpers';

@Component({
    selector: 'app-magazines',
    template: `
        <div
            class="magazine"
            *ngFor="let magazine of db?.get()"
            (click)="onMagazineClick.emit(magazine)"
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
    @Input() db: MagazinesDB | null = null

    @Output() onMagazineClick = new EventEmitter<Magazine>()
}
