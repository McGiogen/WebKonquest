import {Planet} from '../planet';

export enum RequestAction {
  NewGame = 'new-game',
  ConnectToGame = 'connect-to-game',
  StartGame = 'start-game',
  Attack = 'attack',
  EndTurn = 'end-turn',
}

export class Request {
  constructor(readonly action: string, readonly playerId: number) {}
}

export class NewGameRequest extends Request {
  constructor(playerId: number) {
    super(RequestAction.NewGame, playerId);
  }
}

export class ConnectToGameRequest extends Request {
  constructor(playerId: number, readonly gameId: number) {
    super(RequestAction.ConnectToGame, playerId);
  }
}

export class StartGameRequest extends Request {
  constructor(playerId: number, readonly gameId: number) {
    super(RequestAction.StartGame, playerId);
  }
}

export class AttackRequest extends Request {
  constructor(playerId: number, readonly gameId: number, readonly attackSource: Planet, readonly attackDestination: Planet, readonly attackShipCount: number) {
    super(RequestAction.Attack, playerId);
  }
}

export class EndTurnRequest extends Request {
  constructor(playerId: number, readonly gameId: number) {
    super(RequestAction.EndTurn, playerId);
  }
}
