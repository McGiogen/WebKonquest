//---------------------------------------------------------------------------
// class Game
// class GameUtils
// class GameModel
//---------------------------------------------------------------------------

import {Coordinate} from "./coordinate";
import {GameMap} from "./map";
import {AttackFleet, DefenseFleet, Fleet} from "./fleet";
import {Planet} from "./planet";
import {Player} from "./player";
import {NeutralPlayer} from "./neutralPlayer";
import {GameMachine} from "./gameMachine";
import {GameConfig} from "./config";
import {GameEmitter} from "./event";
import {log} from "./logger";

export abstract class Game {
  eventEmitter: GameEmitter;
  model: GameModel;
  machine: GameMachine;

  protected constructor(public gameConfig: GameConfig) {
    this.eventEmitter = new GameEmitter();
    this.machine = new GameMachine(this.eventEmitter);
    const neutral = new NeutralPlayer(this);
    this.model = new GameModel(neutral, gameConfig);

    // finalState = new
    // gameMachine.addState(finalState)
  }

  abstract start(): void;

  abstract stop(): void;

  isRunning(): boolean {
    return this.machine.isRunning();
  }

  doFleetArrival(fleet: AttackFleet): boolean {
    // First, sanity check
    if (fleet.arrivalTurn !== this.model.turnCounter) {
      return false;
    }

    // Check to see of (fleet owner) == (planet owner)
    // if the planet and fleet owner are the same, then merge the fleets
    // otherwise attack.
    if (fleet.owner === fleet.destination.owner) {
      fleet.destination.fleet.absorb(fleet);
      // if (!fleet.owner.isAiPlayer()) {
      log.info(`Reinforcements (${fleet.shipCount} ships) have arrived for planet ${fleet.destination}.`)
      // }
    } else {
      // let's get ready to rumble...
      const attacker: AttackFleet = fleet;
      const attackerPlanet: Planet = attacker.source;
      const defenderPlanet: Planet = attacker.destination;
      const defender: DefenseFleet = defenderPlanet.fleet;

      let haveVictor = false;
      let planetHolds = true;

      while (!haveVictor) {
        const attackerRoll = Random.getDouble();
        const defenderRoll = Random.getDouble();

        /* special case if both have 0 kill percentages */
        if (defenderPlanet.killPercentage == 0 && attackerPlanet.killPercentage == 0) {
          if (attackerRoll < defenderRoll) {
            this.makeKill(defender, attackerPlanet.owner);
          } else {
            this.makeKill(attacker, defenderPlanet.owner);
          }
        }

        if (defenderRoll < defenderPlanet.killPercentage) {
          this.makeKill(attacker, defenderPlanet.owner);
        }

        if (attacker.shipCount <= 0) {
          haveVictor = true;
          planetHolds = true;
          continue;
        }

        if (attackerRoll < attackerPlanet.killPercentage) {
          this.makeKill(defender, attackerPlanet.owner);
        }

        if (defender.shipCount <= 0) {
          haveVictor = true;
          planetHolds = false;
        }
      }

      if (planetHolds) {
        defenderPlanet.owner.enemyFleetsDestroyed++;
        log.info(`Planet ${defenderPlanet} has held against an attack from ${attacker.owner}`);
      } else {
        attacker.owner.enemyFleetsDestroyed++;
        defenderPlanet.conquer(attacker);

        log.info(`Planet ${defenderPlanet} has fallen to ${defenderPlanet.owner}`)
      }
    }
    return true;
  }

  makeKill(fleet: Fleet, player: Player): void {
    fleet.removeShips(1);
    player.enemyShipsDestroyed++;
  }

  findWinner(): void {
    log.info(`Searching for survivors`);
    // Check for survivors
    let alives = this.model.players
      .filter(p => !p.isDead() && !p.isNeutral() && !p.isSpectator());

    if (alives.length <= 1) {
      // We got a winner
      // const winner = alives[0];
      this.stop();
    }
  }

  attack(sourcePlanet: Planet, destPlanet: Planet, shipCount: number, standingOrder: boolean): boolean {
    const arrival = Math.ceil(GameMap.distance(sourcePlanet, destPlanet)) + this.model.turnCounter;
    if (standingOrder) {
      this.model.currentPlayer.addStandingOrder(new AttackFleet(sourcePlanet, destPlanet, shipCount, arrival));
      return true;
    }
    else {
      const fleet: AttackFleet = sourcePlanet.fleet.spawnAttackFleet(destPlanet, shipCount, arrival);
      if (fleet) {
        this.model.currentPlayer.addAttackFleet(fleet);
        return true;
      }
      return false;
    }
  }

  newTurn(): void {
    this.model.turnCounter++;
  }
}

export class GameUtils {
  static generatePlanetCoordinates(x: number, y: number): Coordinate {
    return new Coordinate(Random.getInteger(x), Random.getInteger(y));
  }

  static generateKillPercentage(): number {
    // 0.30 - 0.90
    return Random.getDouble(0.30, 0.90);
  }

  static generatePlanetProduction(): number {
    // 5 - 15
    return Random.getInteger(10, 5);
  }
}

export class GameModel {
  turnCounter: number;
  map: GameMap;
  players: Array<Player>;

  currentPlayer: Player;

  constructor(public neutral: NeutralPlayer, public configs: GameConfig) {
    this.turnCounter = 0;
    this.currentPlayer = null;
    this.map = new GameMap();
    this.map.resizeMap(configs.mapHeight, configs.mapWidth);
    this.players = [];
  }

  getPlanets(): Array<Planet> {
    return this.map.getPlanets();
  }
}

export class Random {
  static getInteger(max: number = Number.MAX_VALUE, min: number = 0): number {
    return Math.floor(Random.getDouble(max, min));
  }

  static getDouble(max: number = 1, min: number = 0): number {
    return (Math.random() * (max - min)) + min;
  }
}
