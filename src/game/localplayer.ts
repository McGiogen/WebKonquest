import {Game} from "./game";
import {Player} from "./player";
import {gameEmitter, GameEvent} from "./event";
import {PlayerLook} from "./playerLook";
import {log} from "./logger";

export class LocalPlayer extends Player {
  constructor(game: Game, name: string, planetLook: PlayerLook) {
    super(game, name, planetLook);
  }

  play(): void {
    log.debug(`${this}::play`);
    gameEmitter.emit(GameEvent.PlayerTurnStart, this);
  }

  done(): void {
    log.debug(`${this}::done`);
    gameEmitter.emit(GameEvent.PlayerTurnDone, this);
  }
}
