import {Planet} from '../planet';

export enum ResponseAction {
  ConnectToServer = 'connect-to-server',
  NewGame = 'new-game',
  ConnectToGame = 'connect-to-game',
  Attack = 'attack',
  EndTurn = 'end-turn',
}

export class Response {
  constructor(readonly action: string) {}
}

export class ConnectToServerResponse extends Response {
  constructor(readonly playerId: number) {
    super(ResponseAction.ConnectToServer);
  }
}

export class NewGameResponse extends Response {
  constructor() {
    super(ResponseAction.NewGame);
  }
}

export class ConnectToGameResponse extends Response {
  constructor(readonly gameId: number) {
    super(ResponseAction.NewGame);
  }
}

export class AttackResponse extends Response {
  constructor(readonly attackSource: Planet, readonly attackDestination: Planet, readonly attackShipCount: number) {
    super(ResponseAction.Attack);
  }
}

export class EndTurnResponse extends Response {
  constructor() {
    super(ResponseAction.EndTurn);
  }
}
