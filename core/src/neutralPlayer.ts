import {Player} from "./player";
import {Game} from "./game";
import {gameEmitter, GameEvent} from "./event";
import {log} from "./logger";

export class NeutralPlayer extends Player {
  constructor(game: Game) {
    super(game, 'neutral');
  }

  isNeutral(): boolean {
    return true;
  }

  isDead(): boolean {
    return false;
  }

  play(): void {
    log.debug('NeutralPlayer::play');

    // Go on each attack...
    for (let player of this.game.model.players) {
      player.resetTurnStats();

      for (let fleet of player.attackList) {
        if (this.game.doFleetArrival(fleet)) {
          player.attackDone(fleet);
        } else {
          // Only add the number of ships of the fleet to the player's
          // total fleet size if the fleet does not arrive this turn.
          player.turnShips += fleet.shipCount;
        }
      }
    }

    // Go over each planet, adding its ships
    for (let planet of this.game.model.getPlanets()) {
      log.debug(`Turn for planet ${planet}`);
      planet.turn(this.game.model.configs);
    }

    this.game.findWinner();

    // After all that mess... It's done
    gameEmitter.emit(GameEvent.PlayerTurnDone);
  }
}
