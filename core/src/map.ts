//---------------------------------------------------------------------------
// class Map
//---------------------------------------------------------------------------

import {Sector} from "./sector";
import {Coordinate} from "./coordinate";
import {Planet} from "./planet";
import {GameUtils} from "./game";
import {Player} from "./player";
import {NeutralPlayer} from "./neutralPlayer";

export class GameMap {
  public grid: Array<Array<Sector>>;
  private planetNameGenerator: IterableIterator<string>;

  constructor(private rowsCount: number, private columnsCount: number) {
    this.resizeMap(rowsCount, columnsCount);

    this.planetNameGenerator = GameMap.planetNameGenerator();
  }

  resizeMap(rowsCount: number, columnsCount: number): void {
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;

    // Initialize the grid of Sectors
    this.grid = GameMap.createArray<Array<Sector>>(
      rowsCount,
      row => GameMap.createArray<Sector>(
        columnsCount,
        col => new Sector(new Coordinate(row, col))
      )
    );
  }

  getPlanets(): Array<Planet> {
    return this.grid
      .reduce((a, b) => a.concat(b))
      .filter(sector => sector.planet != null)
      .map(sector => sector.planet);
  }

  addPlanet(sector: Sector, player: Player, prodRate: number, killPercentage: number): void {
    const planetName = this.planetNameGenerator.next().value;
    sector.planet = new Planet(planetName, player, prodRate, killPercentage, sector.coordinate);
  }

  addPlayerPlanetSomewhere(player: Player): Planet | null {
    const sector: Sector = this.findRandomFreeSector();
    if (!sector) {
      return null;
    }
    const planetName = this.planetNameGenerator.next().value;
    sector.planet = Planet.createPlayerPlanet(planetName, player, sector.coordinate);
    return sector.planet;
  }

  addNeutralPlanetSomewhere(neutral: NeutralPlayer): Planet | null {
    const sector: Sector = this.findRandomFreeSector();
    if (!sector) {
      return null;
    }
    const planetName = this.planetNameGenerator.next().value;
    sector.planet = Planet.createNeutralPlanet(planetName, neutral, sector.coordinate);
    return sector.planet;
  }

  removePlayerPlanet(player: Player): boolean {
    for (let planet of this.getPlanets()) {
      if (planet.owner === player) {
        const sector = this.grid
          .reduce((a, b) => a.concat(b))
          .find(sector => sector.planet === planet);
        sector.planet = null;
        return true;
      }
    }
    return false;
  }

  removePlayerPlanets(player: Player): void {
    while (this.removePlayerPlanet(player)) {}
  }

  turnOverPlayerPlanets(owner: Player, newOwner: Player): void {
    for (let planet of this.getPlanets()) {
      if (planet.owner === owner) {
        planet.owner = newOwner;
      }
    }
  }

  playerPlanetCount(player: Player): number {
    let count = 0;
    for (let planet of this.getPlanets()) {
      if (planet.owner === player) {
        count++;
      }
    }
    return count;
  }

  clearMap(): void {
    for (let row of this.grid) {
      for (let sector of row) {
        sector.planet = null
      }
    }
  }

  populateMap(players: Array<Player>, neutral: Player, numNeutralPlanets: number): void {
    // Create a planet for each player.
    for (let player of players) {
      this.addPlayerPlanetSomewhere(player);
    }

    for (let x = 0; x < numNeutralPlanets; ++x) {
      const sector = this.findRandomFreeSector();
      if (sector) {
        const planetName = this.planetNameGenerator.next().value;
        sector.planet = Planet.createNeutralPlanet(planetName, neutral, sector.coordinate);
      }
    }
  }

  static distance(p1: Planet, p2: Planet): number {
    let diff = p1.coordinate.subtract(p2.coordinate);

    return Math.sqrt((diff.x * diff.x) + (diff.y * diff.y)) / 2;	// Yes, we're dividing by two. It's not a bug, it's a feature.
  }

  findRandomFreeSector(): Sector {
    let freeSectorExists = this.grid
      .reduce((a, b) => a.concat(b))
      .some(sector => sector.planet == null);

    if (!freeSectorExists) {
      return null;
    }

    let c: Coordinate;
    do {
      c = GameUtils.generatePlanetCoordinates(this.rowsCount, this.columnsCount);
    } while (this.grid[c.x][c.y].planet != null);

    return this.grid[c.x][c.y];
  }

  childSectorUpdate() {
    // emit update();
  }

  // TODO business logic -> sposta
  static * planetNameGenerator(): IterableIterator<string> {
    let charCode: number = 'A'.charCodeAt(0);

    for (let i = 0; i < 50; i++) {
        yield String.fromCharCode(charCode + i);
    }
  }

  static createArray<T>(size: number, fillFn: (index: number) => T): Array<T> {
    return Array(size)
      .fill(null)
      .map((el, index) => fillFn(index));
  }
}
