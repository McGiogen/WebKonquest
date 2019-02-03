import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameMap, Sector, Planet, Player} from 'webkonquest-core';
import {AppOptions} from '../../services/AppOptions';

@Component({
  selector: 'app-game-map',
  templateUrl: 'game-map.component.html',
  styleUrls: ['game-map.component.scss'],
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
