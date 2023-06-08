import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { AppMainNoroutes } from './app.main_noroutes';
import { AppMainRoutes } from './app.main_routes';

import { AppMagazines } from './app.magazines';
import { AppMagazine } from './app.magazine';
import { AppYear } from './app.year';
import { AppPublication } from './app.publication';

import { AppIncome } from './app.income';

@NgModule({
    declarations: [
        AppComponent,

        AppMainNoroutes,
        AppMainRoutes,

        AppMagazines,
        AppMagazine,
        AppYear,
        AppPublication,

        AppIncome,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
