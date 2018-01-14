import {Player} from "./player";
import {Game} from "./game";
import {gameEmitter, GAME_EVENT} from "./event";

export class NeutralPlayer extends Player {
  constructor(game: Game) {
    super(game, 'neutral', 'gray');
  }

  isNeutral(): boolean {
    return true;
  }

  isDead(): boolean {
    return false;
  }

  play(): void {
    //qDebug() << "NeutralPlayer::play";

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
    for (let planet of this.game.model.map.getPlanets()) {
      //qDebug() << "Turn for planet " << planet->name();
      planet.turn(this.game.model.options);
    }

    this.game.findWinner();

    // After all that mess... It's done
    gameEmitter.emit(GAME_EVENT.PLAYER_TURN_DONE);
  }
}
