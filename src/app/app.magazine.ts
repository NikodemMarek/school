import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Magazine, MagazinesService } from './service.magazines';

@Component({
    selector: 'app-magazine',
    template: `
        <button
            *ngFor="let year of show?.years"
            (click)="onYearClick.emit(year?.year || '')"
        >
            {{ year?.year }}
        </button>

        <button (click)="onYearClick.emit('all')">
            wszystkie
        </button>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `],
    providers: [
        MagazinesService,
    ],
})
export class AppMagazine {
    constructor(private db: MagazinesService) { }
    ngOnInit() {
        this.db.init().then(() => {
            if (!this.magazine)
                return;

            this.show = this.db
                .getMagazine(this.magazine!)
        })
    }

    @Input() magazine: string | undefined = undefined;
    protected show: Magazine | undefined = undefined;

    @Output() onYearClick = new EventEmitter<string>()
}
