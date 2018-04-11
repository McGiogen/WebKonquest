import {AttackMessage, ConnectToGameMessage, EndTurnMessage, Message, MessageAction, NewGameMessage} from './message';
import {RemoteGame} from './remotegame';
import {GameConfig} from '../config';
import {Player} from '../player';
import {log} from '../logger';
import {RemotePlayer} from './remoteplayer';
import {ConnectToServerResponse, Response} from './response';
import {
  AttackRequest, ConnectToGameRequest, EndTurnRequest, NewGameRequest, Request, RequestAction,
  StartGameRequest
} from './request';

const games: Array<RemoteGame> = [];

export class GameServer {
  static getConnectionResponse(playerId: number): Response {
    return new ConnectToServerResponse(playerId);
  }

  static handleMessage(msg: Request): Response | void {
    switch (msg.action) {
      case MessageAction.NewGame:
        return GameServer.newGame(msg as NewGameRequest);

      case RequestAction.ConnectToGame:
        return GameServer.connectToGame(msg as ConnectToGameRequest);

      case RequestAction.Attack:
        return GameServer.playerAttack(msg as AttackRequest);

      case RequestAction.EndTurn:
        return GameServer.playerEndTurn(msg as EndTurnRequest);

      default:
        log.error('Received request not recognized.', msg);
    }
  }

  private static newGame(msg: NewGameRequest): Response | void {
    log.debug('Received new game request.', msg);
    const gameId = Math.random();
    const game = new RemoteGame(new GameConfig(), gameId);
    game.addPlayer(new RemotePlayer(game, 'Player 1', msg.playerId));
    games.push(game);
  }

  private static connectToGame(msg: ConnectToGameRequest): Response | void {
    const game = GameServer.getGame(msg.gameId);
    if (game.isRunning()) throw new Error(`Game ${msg.gameId} is running.`);

    log.debug('Received connect to game request.', msg);
    const playerName = `Player ${game.model.players.length + 1}`;
    game.addPlayer(new RemotePlayer(game, playerName, msg.playerId));
  }

  private static startGame(msg: StartGameRequest) {
    const game = GameServer.getGame(msg.gameId);
    if (game.isRunning()) throw new Error(`Game ${msg.gameId} is running.`);

    log.debug('Received start game request.', msg);
    game.start();
  }

  private static playerAttack(msg: AttackRequest): Response | void {
    const game = GameServer.getGame(msg.gameId);
    if (!game.isRunning()) throw new Error(`Game ${msg.gameId} is not running.`);

    log.debug('Received attack request.', msg);
    game.attack(msg.attackSource, msg.attackDestination, msg.attackShipCount, false);
  }

  private static playerEndTurn(msg: EndTurnRequest): Response | void {
    const game = GameServer.getGame(msg.gameId);
    if (!game.isRunning()) throw new Error(`Game ${msg.gameId} is not running.`);

    log.debug('Received end turn request.', msg);
    let player = game.machine.currentState as Player;
    if (player instanceof RemotePlayer) {
      player.done();
    }
  }

  private static getGame(gameId: number): RemoteGame {
    const game = games.find(game => game.id === gameId);
    if (!game) throw new Error(`Game ${gameId} not exists.`);
    return game;
  }
}
