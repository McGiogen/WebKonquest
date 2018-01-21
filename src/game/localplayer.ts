import {Game} from "./game";
import {Player} from "./player";
import {gameEmitter, GameEvent} from "./event";
import {PlanetLook} from "./planet";

export class LocalPlayer extends Player {
  constructor(game: Game, name: string, planetLook: PlanetLook) {
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
