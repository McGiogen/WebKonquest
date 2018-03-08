import {Game} from "./game";
import {gameEmitter, GameEvent} from "./event";
import {AttackFleet} from "./fleet";
import {Planet, PlanetLook} from "./planet";
import {GameMachineState} from "./gameMachine";

export class PlayerLook {
  constructor(public name: string, public planetImage: string) {}
}

export abstract class Player implements GameMachineState {
  // Attack fleets sent by this player that are still moving
  public attackList: Array<AttackFleet>;
  // Fleets to send at the end of this turn
  protected newAttacks: Array<AttackFleet>;
  protected standingOrders: Array<AttackFleet>;

  // Stats
  shipsBuilt: number;
  shipCount: number;
  planetsConquered: number;
  fleetsLaunched: number;
  enemyFleetsDestroyed: number;
  enemyShipsDestroyed: number;
  turnProduction: number;
  turnShips: number;

  static looks: PlayerLook[] = [
    new PlayerLook( 'One', 'planet1.png' ),
    new PlayerLook( 'Two', 'planet2.png' ),
    new PlayerLook( 'Three', 'planet3.png' )
  ];

  constructor(protected game: Game, public name: string, public planetLook: PlanetLook) {
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

    //qDebug() << "Entering state for player " << m_name;
    //qDebug() << this->metaObject()->className();
    this.game.model.currentPlayer = this;
    if (this.isDead()) {
      gameEmitter.emit(GameEvent.PlayerTurnDone);
    } else {
      this.play();
    }
  }

  onExit(): void {
    //qDebug() << "Exiting state for player " << m_name;
    //qDebug() << "We are moving our new attacks to our attacks";
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

  // coloredName() const
  // {
  //   return QString("<font color=\"%1\">%2</font>").arg(m_color.name(), m_name);
  // }

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
