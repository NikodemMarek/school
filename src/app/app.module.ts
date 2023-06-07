import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { AppMainNoroutes } from './app.main_noroutes';
import { AppMainRoutes } from './app.main_routes';

import { AppMagazines } from './app.magazines';
import { AppMagazine } from './app.magazine';
import { AppYear } from './app.year';
import { AppPublication } from './app.publication';

@NgModule({
    declarations: [
        AppComponent,

        AppMainNoroutes,
        AppMainRoutes,

        AppMagazines,
        AppMagazine,
        AppYear,
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
