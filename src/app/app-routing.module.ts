import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppMainNoroutes } from './app.main_noroutes';
import { AppMainRoutes } from './app.main_routes';

const routes: Routes = [
    { path: 'noroutes', component: AppMainNoroutes },

    { path: '', component: AppMainRoutes },
    { path: ':magazine', component: AppMainRoutes },
    { path: ':magazine/:year', component: AppMainRoutes },

    { path: '**',   redirectTo: '/' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            bindToComponentInputs: true,
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }
