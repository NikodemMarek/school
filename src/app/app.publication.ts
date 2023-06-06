import { Component, Input } from '@angular/core';

import { Publication } from './helpers';

@Component({
    selector: 'app-publication',
    template: `
        <img
            [src]="publication?.thumbnail"
            [alt]="publication?.name"
        />

        <div class="info">
            {{ publication?.name }}

            <span class="number">
                {{ publication?.number }}
            </span>

            <span class="pages">
                {{ publication?.pages }}
            </span>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1rem;
        }
    `],
})
export class AppPublication {
    @Input() publication: Publication | null = null
}
