import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Czasopisma } from './helpers';

@Component({
    selector: 'app-root',
    template: `
        {{ czasopisma.getMagazine('Avax') | json }}
    `,
    styles: [`
    `],
})
export class AppComponent {
    protected czasopisma: Czasopisma

	constructor(private http: HttpClient) {
        this.czasopisma = new Czasopisma(this.http);
    }
}
