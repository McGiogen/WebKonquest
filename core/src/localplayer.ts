import {Game} from "./game";
import {Player} from "./player";
import {gameEmitter, GameEvent} from "./event";
import {log} from "./logger";

export class LocalPlayer extends Player {
  constructor(game: Game, name: string) {
    super(game, name);
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
