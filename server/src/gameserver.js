"use strict";
exports.__esModule = true;
var webkonquest_core_1 = require("webkonquest-core");
var GameServer = /** @class */ (function () {
    function GameServer() {
        this.games = {};
    }
    /*public handleMessage(msg: any): any {
      switch (msg.action) {
        case 'start-game':
          return this.attack();
  
        case 'attack':
          return this.attack();
  
        case 'end-turn':
          return this.endTurn();
  
        default:
          console.warn('Received request not recognized.', msg);
      }
    }*/
    GameServer.prototype.newGame = function (msg) {
        var gameId = Math.random();
        var gameConfig = new webkonquest_core_1.GameConfig();
        if (msg.neutral.planets) {
            gameConfig.neutralPlanets = msg.neutral.planets;
        }
        var game = new webkonquest_core_1.LocalGame(gameConfig);
        this.games[gameId] = game;
        game.model.neutral.look = msg.neutral.look;
        // Adding some data to the game
        for (var i = 0; i < msg.players.length; i++) {
            var playerData = msg.players[i];
            // Human player
            var name_1 = playerData.name || "Player " + (i + 1);
            var player = new webkonquest_core_1.LocalPlayer(game, name_1);
            player.look = playerData.look;
            game.addPlayer(player);
            // game.model.map.addPlayerPlanetSomewhere(player);
        }
        game.model.map.populateMap(game.model.players, game.model.neutral, gameConfig.neutralPlanets);
        console.debug('Received start game request.', msg);
        game.start();
        return gameId;
    };
    GameServer.prototype.playerAttack = function (msg) {
        var game = this.getGame(msg.gameId);
        if (!game.isRunning())
            throw new Error("Game " + msg.gameId + " is not running.");
        console.debug('Received attack request.', msg);
        game.attack(msg.attackSource, msg.attackDestination, msg.attackShipCount, false);
    };
    GameServer.prototype.playerEndTurn = function (msg) {
        var game = this.getGame(msg.gameId);
        if (!game.isRunning())
            throw new Error("Game " + msg.gameId + " is not running.");
        console.debug('Received end turn request.', msg);
        var player = game.machine.currentState;
        if (player instanceof RemotePlayer) {
            player.done();
        }
    };
    GameServer.prototype.getGame = function (gameId) {
        var game = this.games[gameId];
        if (!game)
            throw new Error("Game " + gameId + " not exists.");
        return game;
    };
    return GameServer;
}());
exports.GameServer = GameServer;
