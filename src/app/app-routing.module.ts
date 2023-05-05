import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: '/settings', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  { path: 'game', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    bindToComponentInputs: true,
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
