import {NgModule} from '@angular/core';
import {GameMapComponent} from './game-map/game-map.component';
import {CommonModule} from '@angular/common';
import {ColorSelectorComponent} from './color-selector/color-selector.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [
    GameMapComponent,
    ColorSelectorComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    GameMapComponent,
    ColorSelectorComponent
  ]
})
export class ComponentsModule {
}
