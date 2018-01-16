import {Game} from "./game";
import {Player} from "./player";
import {gameEmitter, GameEvent} from "./event";

export class LocalPlayer extends Player {
  constructor(game: Game, name: string, color: string) {
    super(game, name, color);
  }

  play(): void {
    //qDebug() << name() << "::play";
    gameEmitter.emit(GameEvent.PlayerTurnStart, this);
  }

  done(): void {
    //qDebug() << name() << "::done";
    gameEmitter.emit(GameEvent.PlayerTurnDone, this);
  }
}
