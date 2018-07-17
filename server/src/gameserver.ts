import { LocalGame, GameConfig, LocalPlayer, Player, GameEvent } from "webkonquest-core";

interface Map<T> {
    [id: number]: T;
}

export class GameServer {
  games: Map<LocalGame> = {};

  public handleMessage(msg: { type: string, data: any }): { type: string, data: any } {
    switch (msg.type) {
      case 'start-game':
        return {
          type: 'start-game',
          data: this.startGame(msg.data),
        };

      /*case 'attack':
        return this.attack(msg);

      case 'end-turn':
        return this.endTurn(msg);*/

      default:
        console.warn('Received request not recognized.', msg);
    }
  }

  public startGame(data: any): number {
    const gameId = Math.random();
    const gameConfig = new GameConfig();

    if (data.neutral.planets) {
      gameConfig.neutralPlanets = data.neutral.planets;
    }

    const game = new LocalGame(gameConfig);
    this.games[gameId] = game;

    game.model.neutral.look = data.neutral.look;

    // Adding some data to the game
    for (let i = 0; i < data.players.length; i++) {
      const playerData = data.players[i];

      // Human player
      const name = playerData.name || `Player ${i + 1}`;
      const player = new LocalPlayer(game, name);
      player.look = playerData.look;
      game.addPlayer(player);
      // game.model.map.addPlayerPlanetSomewhere(player);
    }

    game.model.map.populateMap(game.model.players, game.model.neutral, gameConfig.neutralPlanets);

    console.debug('Received start game request.', data);
    game.start();

    return gameId;
  }

  public playerAttack(msg: any): any {
    const game = this.getGame(msg.gameId);
    if (!game.isRunning()) throw new Error(`Game ${msg.gameId} is not running.`);

    console.debug('Received attack request.', msg);
    game.attack(msg.attackSource, msg.attackDestination, msg.attackShipCount, false);
  }

  public playerEndTurn(msg: any): any {
    const game = this.getGame(msg.gameId);
    if (!game.isRunning()) throw new Error(`Game ${msg.gameId} is not running.`);

    console.debug('Received end turn request.', msg);
    let player = game.machine.currentState as Player;
    if (player instanceof LocalPlayer) {
      player.done();
    }
  }

  public getGame(gameId: number): LocalGame {
    const game = this.games[gameId];
    if (!game) throw new Error(`Game ${gameId} not exists.`);
    return game;
  }
}