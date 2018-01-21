//---------------------------------------------------------------------------
// class Planet
//---------------------------------------------------------------------------

import {DefenseFleet} from "./fleet";
import {GameUtils} from "./game";
import {Player} from "./player";
import {Coordinate} from "./coordinate";
import {GameConfig} from "./config";

export class Planet {
  planetLook: number;
  readonly originalProductionRate: number;
  fleet: DefenseFleet;
  private oldShips: number;

  private showCurrentShips: boolean;
  private justConquered: boolean;

  constructor(readonly name: string, public owner: Player, public productionRate: number, public killPercentage: number, public coordinate: Coordinate) {
    this.fleet = new DefenseFleet(this, 0);
    this.originalProductionRate = this.productionRate;
    this.oldShips = this.productionRate;

    // initial state
    this.showCurrentShips = true;
    this.justConquered = false;
    this.planetLook = Math.floor(Math.random() * 9);

    // connect
    // connect(&m_homeFleet, &DefenseFleet::update, this, &Planet::update);
  }

  conquer(attackingFleet) {
    this.owner.deleteStandingOrders(this);
    this.owner = attackingFleet.owner;
    this.owner.planetsConquered++;
    this.fleet.become(attackingFleet);
    this.productionRate = this.originalProductionRate;
    this.justConquered = true;
  }

  // TODO probabilmente business logic -> sposta
  turn(config: GameConfig) {
    //qDebug() << "Planet::turn...";

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
    // emit update();
  }

  destroy() {
    // this.sector.removePlanet();
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
