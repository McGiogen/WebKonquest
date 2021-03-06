import { LocalGame, GameConfig, LocalPlayer, Player, GameEvent, Sector, DefenseFleet, AttackFleet, Planet, Fight } from "webkonquest-core";
import { truncate } from "fs";

interface Map<T> {
    [id: number]: T;
}

export class GameServer {
  games: Map<LocalGame> = {};
  ws: Map<any> = {};

  public handleMessage(msg: { type: string, data: any }, ws: any): { type: string, data: any } {
    switch (msg.type) {
      case 'start-game': {
        msg.data.gameId = Math.round(Math.random() * 10000);
        this.ws[msg.data.gameId] = ws;
        const data = this.startGame(msg.data);

        return {
          type: msg.type,
          data,
        };
      }

      case 'attack': {
        const data = this.playerAttack(msg.data);

        return {
          type: msg.type,
          data,
        };
      }

      case 'cancel-attack': {
        this.cancelPlayerAttack(msg.data);
        break;
      }

      case 'end-turn': {
        return this.playerEndTurn(msg.data);
      }

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
    const map = GameServer.getMapToSend(game);

    return { gameId, map };
  }

  public changeRound(gameId: number) {
    const game = this.getGame(gameId);
    const map = GameServer.getMapToSend(game);
    const turnCounter = game.model.turnCounter;
    const newFights = GameServer.getNewFightsToSend(game);

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
    const currentPlayer = GameServer.getCurrentPlayerToSend(this.getGame(gameId));

    this.getWs(gameId).send(JSON.stringify({
      type: 'change-turn',
      data: {
        currentPlayer,
      }
    }));
  }

  public endGame(gameId: number) {
    const winner = GameServer.withoutPlayerCircularity(this.getGame(gameId).model.winner);

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

    const source = game.model.map.getPlanets().find(p => p.name === data.attack.source.name);
    const destination = game.model.map.getPlanets().find(p => p.name === data.attack.destination.name);

    console.log('Received attack request.', data);
    const success = game.attack(source, destination, Number(data.attack.shipCount), false);
    let attack = data.attack;
    if (success) {
      const index = game.model.currentPlayer.newAttacks.length - 1;
      attack = GameServer.withoutAttackFleetCircularity(game.model.currentPlayer.newAttacks[index]);
    }
    const map = GameServer.getMapToSend(game);
    return { success, map, attack };
  }

  public cancelPlayerAttack(data: any): any {
    const game = this.getGame(data.gameId);
    if (!game.isRunning()) throw new Error(`Game ${data.gameId} is not running.`);

    const currentPlayer = game.machine.currentState as Player;
    const attack = currentPlayer.newAttacks
      .find(a =>
        a.source.name === data.attack.source.name
          && a.destination.name === data.attack.destination.name
          && Number(a.shipCount) === Number(data.attack.shipCount)
      );
    currentPlayer.cancelNewAttack(attack);
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

  private static getMapToSend(game: LocalGame): any {
    const map = game.model.map.clone();
    map.grid.forEach((row:Array<Sector>, i) => {
      row.forEach((sector:Sector, y) => {
        const p = map.grid[i][y].planet;
        if (p) {
          map.grid[i][y].planet = GameServer.withoutPlanetCircularity(p);
        }
      });
    });
    return map;
  }

  private static getCurrentPlayerToSend(game: LocalGame): any {
    const p = game.machine.currentState as Player
    return GameServer.withoutPlayerCircularity(p);
  }

  private static getNewFightsToSend(game: LocalGame) {
    return game.model.newFights.map(fight => {
      const { attackerShips, defenderShips, turn, winnerShips } = fight;
      return <Fight>{
        turn,
        attacker: GameServer.withoutPlayerCircularity(fight.attacker),
        attackerPlanet: GameServer.withoutPlanetCircularity(fight.attackerPlanet),
        attackerShips,
        winner: GameServer.withoutPlayerCircularity(fight.winner),
        defender: GameServer.withoutPlayerCircularity(fight.defender),
        defenderPlanet: GameServer.withoutPlanetCircularity(fight.defenderPlanet),
        defenderShips,
        winnerShips,
      };
    })
  }

  private static withoutPlayerCircularity(p: Player, attacks: boolean = true): Player {
    if (attacks) {
      return <Player>{
        name: p.name,
        look: p.look,
        newAttacks: p.newAttacks.map(GameServer.withoutAttackFleetCircularity),
        attackList: p.attackList.map(GameServer.withoutAttackFleetCircularity),
        standingOrders: p.standingOrders.map(GameServer.withoutAttackFleetCircularity),
      };
    } else {
      return <Player>{
        name: p.name,
        look: p.look,
      };
    }
  }

  private static withoutAttackFleetCircularity(fleet: AttackFleet): AttackFleet {
    return <AttackFleet>{
      owner: GameServer.withoutPlayerCircularity(fleet.owner, false),
      source: GameServer.withoutPlanetCircularity(fleet.source),
      destination: GameServer.withoutPlanetCircularity(fleet.destination),
      shipCount: fleet.shipCount,
      arrivalTurn: fleet.arrivalTurn,
    };
  }

  private static withoutPlanetCircularity(planet: Planet): any {
    const { coordinate, killPercentage, name, productionRate, oldShips, originalProductionRate } = planet;
    return <Planet>{
      owner: GameServer.withoutPlayerCircularity(planet.owner, false),
      fleet: {
        shipCount: planet.fleet.shipCount,
      },
      coordinate,
      killPercentage,
      name,
      productionRate,
      oldShips,
      originalProductionRate
    };
  }
}