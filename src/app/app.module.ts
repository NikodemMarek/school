import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SettingsComponent } from './settings/settings.component';
import { SettingsDimensionsComponent } from './settings/dimensions.component';
import { SettingsSizeComponent } from './settings/size.component';

import { GameComponent } from './game/game.component';
import { GameBarComponent } from './game/bar.component';
import { GameBoardComponent } from './game/board.component';
import { GameTileComponent } from './game/tile.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    SettingsDimensionsComponent,
    SettingsSizeComponent,
    GameComponent,
    GameBarComponent,
    GameBoardComponent,
    GameTileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
