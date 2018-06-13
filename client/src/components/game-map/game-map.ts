import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameMap, Sector} from 'webkonquest-core';
import {AppOptions} from "../../services/AppOptions";

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
  private appOptions: AppOptions;

  constructor() {
    this.appOptions = AppOptions.instance;
  }

  selectSector(sector: Sector) {
    if (sector.planet == null) {
      return;
    }
    this.selectedSector = sector;
    this.selectedSectorEmitter.emit(sector);
  }
}
