import {Game} from "../game";
import {Player} from "../player";
import {GameEvent} from "../event";
import {log} from "../logger";

export class LocalPlayer extends Player {
  constructor(game: Game, name: string) {
    super(game, name);
  }

  play(): void {
    log.debug(`${this}::play`);
    this.game.eventEmitter.emit(GameEvent.PlayerTurnStart, this);
  }

  done(): void {
    log.debug(`${this}::done`);
    this.game.eventEmitter.emit(GameEvent.PlayerTurnDone, this);
  }
}
