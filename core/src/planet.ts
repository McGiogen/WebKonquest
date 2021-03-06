//---------------------------------------------------------------------------
// class Planet
//---------------------------------------------------------------------------

import {AttackFleet, DefenseFleet} from "./fleet";
import {GameUtils} from "./game";
import {Player} from "./player";
import {Coordinate} from "./coordinate";
import {GameConfig} from "./config";
import {log} from "./logger";

export class Planet {
  readonly originalProductionRate: number;
  fleet: DefenseFleet;
  oldShips: number;

  private showCurrentShips: boolean;
  private justConquered: boolean;

  constructor(readonly name: string, public owner: Player, public productionRate: number, public killPercentage: number, public coordinate: Coordinate) {
    this.fleet = new DefenseFleet(this, 0);
    this.originalProductionRate = this.productionRate;
    this.oldShips = this.productionRate;

    // initial state
    this.showCurrentShips = true;
    this.justConquered = false;
  }

  conquer(attackingFleet: AttackFleet) {
    this.owner.deleteStandingOrders(this);
    this.owner = attackingFleet.owner;
    this.owner.planetsConquered++;
    this.fleet.become(attackingFleet);
    this.productionRate = this.originalProductionRate;
    this.justConquered = true;
  }

  // TODO probabilmente business logic -> sposta
  turn(config: GameConfig) {
    log.debug(`Turn of planet ${this}.`);

    if (config.productionAfterConquere || !this.justConquered) {
      const shipsProduction = this.owner.isNeutral() ? config.neutralsProduction : this.productionRate;
      this.fleet.addShips(shipsProduction);
      this.owner.shipsBuilt += shipsProduction;
      this.owner.turnProduction += shipsProduction;
      this.owner.shipCount += this.fleet.shipCount;

      if (config.cumulativeProduction) {
        this.productionRate++;
      }
    }

    this.oldShips = this.fleet.shipCount;
    this.showCurrentShips = true;
    this.justConquered = false;
  }

  destroy() {
    // this.sector.removePlanet();
  }

  toString() {
    return this.name;
  }

  clone() {
    const clone = new Planet(this.name, this.owner, this.productionRate, this.killPercentage, this.coordinate);
    clone.fleet = new DefenseFleet(clone, this.fleet.shipCount);
    clone.oldShips = this.oldShips;
    return clone;
  }

  static createPlayerPlanet(planetName: string, initialOwner: Player, coordinate: Coordinate) {
    return new Planet(planetName, initialOwner, 10, 0.400, coordinate);
  }

  static createNeutralPlanet(planetName: string, initialOwner: Player, coordinate: Coordinate) {
    const killPercentage = GameUtils.generateKillPercentage();
    const productionRate = GameUtils.generatePlanetProduction();

    return new Planet(planetName, initialOwner, productionRate, killPercentage, coordinate);
  }
}
