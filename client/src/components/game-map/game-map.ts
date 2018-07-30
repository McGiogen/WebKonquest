import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameMap, Sector, Planet, Player} from 'webkonquest-core';
import {AppOptions} from '../../services/AppOptions';

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
  @Input() currentPlayer: Player;
  @Output('selectedSector') selectedSectorEmitter: EventEmitter<Sector> = new EventEmitter<Sector>();
  selectedSector: Sector;
  appOptions: AppOptions;

  constructor() {
    this.appOptions = AppOptions.instance;
  }

  selectSector(sector: Sector): void {
    if (sector.planet == null) {
      return;
    }
    this.selectedSector = sector;
    this.selectedSectorEmitter.emit(sector);
  }

  getPlanetShips(planet: Planet): string {
    if (planet == null) {
      return '';
    }

    if (this.currentPlayer && planet.owner.name === this.currentPlayer.name) {
      return planet.fleet.shipCount + '';
    } else {
      return planet.oldShips + '';
    }
  }
}
