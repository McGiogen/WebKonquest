import {Game} from '../game';
import {Player} from '../player';
import {GameEvent} from '../event';
import {log} from '../logger';

export class RemotePlayer extends Player {
  constructor(game: Game, name: string, readonly id: number) {
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
