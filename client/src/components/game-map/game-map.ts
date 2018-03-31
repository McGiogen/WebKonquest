import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameMap} from "../../game/map";
import {Sector} from "../../game/sector";

/**
 * Generated class for the GameMapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'game-map',
  templateUrl: 'game-map.html'
})
export class GameMapComponent {

  @Input() map: GameMap;
  @Output('selectedSector') selectedSectorEmitter: EventEmitter<Sector> = new EventEmitter<Sector>();
  selectedSector: Sector;

  constructor() {}

  selectSector(sector: Sector) {
    if (sector.planet == null) {
      return;
    }
    this.selectedSector = sector;
    this.selectedSectorEmitter.emit(sector);
  }
}
