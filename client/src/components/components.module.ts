import {NgModule} from '@angular/core';
import {GameMapComponent} from './game-map/game-map';
import {BrowserModule} from "@angular/platform-browser";
import {ImageSelectorComponent} from './color-selector/color-selector';
import {IonicModule} from "ionic-angular";

@NgModule({
  declarations: [
    GameMapComponent,
    ImageSelectorComponent
  ],
  imports: [
    BrowserModule,
    IonicModule
  ],
  exports: [
    GameMapComponent,
    ImageSelectorComponent
  ]
})
export class ComponentsModule {
}
