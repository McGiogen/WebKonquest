import {Game} from "./game";
import {Player} from "./player";
import {gameEmitter, GameEvent} from "./event";
import {PlayerLook} from "./playerLook";

export class LocalPlayer extends Player {
  constructor(game: Game, name: string, planetLook: PlayerLook) {
    super(game, name, planetLook);
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
