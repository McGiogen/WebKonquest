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
  @Output() selectedSector = new EventEmitter<Sector>();
  selectedSectorValue: Sector;

  constructor(public appOptions: AppOptions) { }

  selectSector(sector: Sector): void {
    if (sector.planet == null) {
      return;
    }
    this.selectedSectorValue = sector;
    this.selectedSector.emit(sector);
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
