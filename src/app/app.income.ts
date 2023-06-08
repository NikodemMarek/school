import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-income',
    template: `
        twoje dochody w zeszłym roku
        <input
            type="password"
            [(ngModel)]="income"
            (keydown)="setCurrent($event)"
            (keyup)="checkIncome()"
        >
        EUR

        <ng-container *ngIf="income">
            <br><br>
            twoje dochody w zeszłym roku to {{ income | currency:'EUR':'symbol':'1.1-3' }}
        </ng-container>
    `,
    styles: [`
    `],
})
export class AppIncome {
    protected income: string = '';

    protected setCurrent = (event: KeyboardEvent) => {
        if (
            ![
                'Enter', 'Tab', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'
            ].includes(event.key)
            || event.key === '.' && this.income.includes('.')
        ) event.preventDefault();
    }

    @Output() protected onSecretIncome = new EventEmitter();
    protected checkIncome = () => {
        if (this.income === '666.666')
            this.onSecretIncome.emit(this.income);
    }
}
