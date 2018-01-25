import { NgModule } from '@angular/core';
import { GameMapComponent } from './game-map/game-map';
import {BrowserModule} from "@angular/platform-browser";
import { ImageSelectorComponent } from './image-selector/image-selector';

@NgModule({
	declarations: [
	  GameMapComponent,
    ImageSelectorComponent
  ],
	imports: [BrowserModule],
	exports: [
	  GameMapComponent,
    ImageSelectorComponent
  ]
})
export class ComponentsModule {}
