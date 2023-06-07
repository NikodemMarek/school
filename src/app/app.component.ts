import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import {default as db} from './helpers';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
    `,
    styles: [`
    `],
})
export class AppComponent {
    constructor(http: HttpClient) {
        db.init(http);
    }
}
