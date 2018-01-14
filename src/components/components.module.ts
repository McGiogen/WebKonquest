import { NgModule } from '@angular/core';
import { GameMapComponent } from './game-map/game-map';
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
	declarations: [GameMapComponent],
	imports: [BrowserModule],
	exports: [GameMapComponent]
})
export class ComponentsModule {}
