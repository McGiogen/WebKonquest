import { LocalGame, GameConfig, LocalPlayer, Player, GameEvent, Sector, DefenseFleet, AttackFleet, Planet } from "webkonquest-core";

interface Map<T> {
    [id: number]: T;
}

export class GameServer {
  games: Map<LocalGame> = {};
  ws: Map<any> = {};

  public handleMessage(msg: { type: string, data: any }, ws: any): { type: string, data: any } {
    switch (msg.type) {
      case 'start-game': {
        msg.data.gameId = Math.random();
        this.ws[msg.data.gameId] = ws;
        const data = this.startGame(msg.data);

        return {
          type: msg.type,
          data,
        };
      }

      case 'attack': {
        const data = this.playerAttack(msg);

        return {
          type: msg.type,
          data,
        };
      }

      /*case 'end-turn':
        return this.endTurn(msg);*/

      default:
        console.warn('Received request not recognized.', msg);
    }
  }

  public startGame(data): { gameId: number, map: any } {
    const gameId = data.gameId;
    console.log('Received start game request.', data);
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

    game.eventEmitter.on(GameEvent.RoundStart, () => this.changeRound(gameId));
    game.eventEmitter.on(GameEvent.PlayerTurnStart, () => this.changeTurn(gameId));
    game.eventEmitter.on(GameEvent.GameOver, () => this.endGame(gameId));

    console.log(`Starting game ${gameId}.`, data);
    game.start();

    // Converting circular structure to non-circular
    const map = this.getMapToSend(game);

    return { gameId, map };
  }

  public changeRound(gameId: number) {
    const game = this.getGame(gameId);
    const map = this.getMapToSend(game);
    const turnCounter = game.model.turnCounter;
    const newFights = game.model.newFights;

    this.getWs(gameId).send(JSON.stringify({
      type: 'change-round',
      data: {
        map,
        turnCounter,
        newFights,
      }
    }));
  }

  public changeTurn(gameId: number) {
    const currentPlayer = this.getCurrentPlayerToSend(this.getGame(gameId));
    /*const turnPlayer = {
      name: currentPlayer.name,
      look: currentPlayer.look
    }
    const newAttacks = currentPlayer.newAttacks;
    const attacksList = currentPlayer.attackList;*/

    this.getWs(gameId).send(JSON.stringify({
      type: 'change-turn',
      data: {
        currentPlayer,
        /*turnPlayer,
        newAttacks,
        attacksList,*/
      }
    }));
  }

  public endGame(gameId: number) {
    const winner = this.getGame(gameId).model.winner

    this.getWs(gameId).send(JSON.stringify({
      type: 'end-game',
      data: {
        winner
      }
    }));

    // TODO clean game data
  }

  public playerAttack(data: any): any {
    const game = this.getGame(data.gameId);
    if (!game.isRunning()) throw new Error(`Game ${data.gameId} is not running.`);

    console.log('Received attack request.', data);
    const success = game.attack(data.attack.source, data.attack.destination, data.attack.ships, false);
    return { success };
  }

  public playerEndTurn(data: any): any {
    const game = this.getGame(data.gameId);
    if (!game.isRunning()) throw new Error(`Game ${data.gameId} is not running.`);

    console.log('Received end turn request.', data);
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

  public getWs(gameId: number): any {
    const ws = this.ws[gameId];
    if (!ws) throw new Error(`WebSocket of game ${gameId} not exists.`);
    return ws;
  }

  private getMapToSend(game: LocalGame): any {
    const map = game.model.map.clone();
    map.grid.forEach((row:Array<Sector>, i) => {
      row.forEach((sector:Sector, y) => {
        const p = map.grid[i][y].planet;
        if (p) {
          p.owner = <Player>{
            name: p.owner.name,
            look: p.owner.look,
          }
          p.fleet = <DefenseFleet>{
            shipCount: p.fleet.shipCount
          }
        }
      });
    });
    return map;
  }

  private getCurrentPlayerToSend(game: LocalGame): any {
    const p = game.machine.currentState as Player
    return this.withoutPlayerCircularity(p);
  }

  private withoutPlayerCircularity(p: Player): Player {
    return <Player>{
      name: p.name,
      look: p.look,
      newAttacks: p.newAttacks.map(this.withoutAttackFleetCircularity),
      attackList: p.attackList.map(this.withoutAttackFleetCircularity),
      standingOrders: p.standingOrders.map(this.withoutAttackFleetCircularity),
    };
  }

  private withoutAttackFleetCircularity(fleet: AttackFleet): AttackFleet {
    return <AttackFleet>{
      owner: this.withoutPlayerCircularity(fleet.owner),
      source: this.withoutPlanetCircularity(fleet.source),
      destination: this.withoutPlanetCircularity(fleet.destination),
      shipCount: fleet.shipCount,
    };
  }

  private withoutPlanetCircularity(planet: Planet): any {
    planet.owner = this.withoutPlayerCircularity(planet.owner);
    planet.fleet = <DefenseFleet>{
      shipCount: planet.fleet.shipCount
    }
    return planet;
  }
}