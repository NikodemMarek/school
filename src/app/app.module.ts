import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppMagazines } from './app.magazines';
import { AppMagazine } from './app.magazine';
import { AppPublication } from './app.publication';

@NgModule({
    declarations: [
        AppComponent,
        AppMagazines,
        AppMagazine,
        AppPublication,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
