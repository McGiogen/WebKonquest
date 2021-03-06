import {Game} from "./game";
import {GameEvent} from "./event";
import {AttackFleet} from "./fleet";
import {Planet} from "./planet";
import {GameMachineState} from "./gameMachine";
import {log} from "./logger";

export abstract class Player implements GameMachineState {
  // Attack fleets sent by this player that are still moving
  public attackList: Array<AttackFleet>;
  public look: string;

  // Fleets to send at the end of this turn
  newAttacks: Array<AttackFleet>;
  standingOrders: Array<AttackFleet>;

  // Stats
  shipsBuilt: number;
  shipCount: number;
  planetsConquered: number;
  fleetsLaunched: number;
  enemyFleetsDestroyed: number;
  enemyShipsDestroyed: number;
  turnProduction: number;
  turnShips: number;

  constructor(protected game: Game, public name: string) {
    this.attackList = [];
    this.newAttacks = [];
    this.standingOrders = [];
    this.shipsBuilt = 0;
    this.planetsConquered = 0;
    this.fleetsLaunched = 0;
    this.enemyFleetsDestroyed = 0;
    this.enemyShipsDestroyed = 0;
    this.turnProduction = 0;
    this.turnShips = 0;
  }

  onEntry(): void {
    if (this.isNeutral()) {
      this.game.newTurn();
    }

    log.debug(`Entering state for player ${this} (${this.constructor.name}).`);
    this.game.model.currentPlayer = this;
    if (this.isDead()) {
      this.game.eventEmitter.emit(GameEvent.PlayerTurnDone);
    } else {
      this.play();
    }
  }

  onExit(): void {
    log.debug(`Exiting state for player ${this}.`);
    log.debug('We are moving our new attacks to our attacks.');
    for (let a of this.standingOrders) {
      const fleet: AttackFleet = a.source.fleet.spawnAttackFleet(a.destination, a.shipCount, a.arrivalTurn);
      a.arrivalTurn++;
      if (fleet) {
        this.newAttacks.push(fleet);
      }
    }
    this.attackList = this.attackList.concat(this.newAttacks);
    this.fleetsLaunched += this.newAttacks.length;
    this.newAttacks = [];
  }

  isDead(): boolean {
    if (this.attackList.length > 0) {
      return false;
    }
    return this.game.model.getPlanets().every(planet => planet.owner !== this);
  }

  isAiPlayer(): boolean {
    return false;
  }

  isNeutral(): boolean {
    return false;
  }

  isSpectator(): boolean {
    return false;
  }

  /**
   * Reset the turn statistics.
   */
  resetTurnStats(): void {
    this.turnProduction = 0;
    this.turnShips = 0;
  }

  attackDone(fleet: AttackFleet): void {
    this.attackList = this.attackList.filter(f => f !== fleet);
  }

  addAttackFleet(fleet: AttackFleet): void {
    this.newAttacks.push(fleet);
  }

  addStandingOrder(fleet: AttackFleet): void {
    this.standingOrders.push(fleet);
  }

  cancelNewAttack(fleet: AttackFleet): void {
    if (!this.newAttacks.includes(fleet)) {
      if (!this.standingOrders.includes(fleet)) {
        return;
      } else {
        this.standingOrders = this.standingOrders.filter(f => f !== fleet);
      }
    } else {
      this.newAttacks = this.newAttacks.filter(f => f !== fleet);
      fleet.source.fleet.absorb(fleet);
    }
  }

  deleteStandingOrders(planet: Planet): void {
    for (let i = 0; i < this.standingOrders.length;) {
      let af = this.standingOrders[i];
      if (af.source === planet) {
        this.standingOrders.splice(i, 1);
      } else {
        i++;
      }
    }
  }

  toString(): string {
    return this.name;
  }

  abstract play(): void;
}
