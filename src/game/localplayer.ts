import {Game} from "./game";
import {Player} from "./player";
import {gameEmitter, GAME_EVENT} from "./event";

export class LocalPlayer extends Player {
  constructor(game: Game, name: string, color: string) {
    super(game, name, color);
  }

  play(): void {
    //qDebug() << name() << "::play";
    gameEmitter.emit(GAME_EVENT.PLAYER_TURN_START, this);
  }

  done(): void {
    //qDebug() << name() << "::done";
    gameEmitter.emit(GAME_EVENT.PLAYER_TURN_DONE, this);
  }
}
