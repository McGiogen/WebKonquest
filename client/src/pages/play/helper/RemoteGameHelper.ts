import {Planet, Player, LocalPlayer, GameMap, AttackFleet, Fight} from 'webkonquest-core';
import {AppOptions, InteractMode} from '../../../services/AppOptions';
import { PlayPage } from '../play';
import { GameHelper } from './GameHelper';
import { SetupGame, SetupPlayer } from '../../setup-game/SetupGameData';
import { GameServerService } from './gameserver.service';
import { Subscription } from 'rxjs/Subscription';

export class RemoteGameHelper implements GameHelper {
  options: AppOptions;

  currentPlayer: Player;

  attack: {focus: Planet, source: Planet, destination: Planet, ships: number };

  turnCounter: number;
  turnPlayer: SetupPlayer;
  winner: SetupPlayer;

  newAttacks: Array<AttackFleet>;
  attacksList: Array<AttackFleet>;
  newFights: Array<Fight>;

  map: GameMap;
  private gameId: number;
  socketSubscription: Subscription;

  constructor(private page: PlayPage, private service: GameServerService) {
    this.options = AppOptions.instance;

    this.turnPlayer = { name: null, look: null };
    this.attack = { focus: null, source: null, destination: null, ships: null };

    this.socketSubscription = this.service.socket.subscribe(this.onServerMessage.bind(this));
  }

  onServerMessage(message: { type: string, data: any }): void {
    console.log('[RemoteGameHelper::onServerMessage]', message);

    switch(message.type) {
      case 'start-game': {
        this.gameId = message.data.gameId;
        this.map = message.data.map
        break;
      }
      case 'change-round': {
        this.changeRound(
          message.data.map,
          message.data.turnCounter,
          message.data.newFights,
        );
        break;
      }
      case 'change-turn': {
        this.changeTurn(
          message.data.currentPlayer,
        );
        break;
      }
      case 'end-game': {
        this.endGame();
        break;
      }
      case 'attack': {
        this.attackResponse(message.data.success);
        break;
      }
    }
  }

  startGame(setup: SetupGame): void {
    // this.game.eventEmitter.on(GameEvent.RoundStart, this.changeRound.bind(this));
    // this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.changeTurn.bind(this));
    // this.game.eventEmitter.on(GameEvent.GameOver, this.endGame.bind(this));

    this.service.send('start-game', setup);
  }

  changeTurn(currentPlayer: Player): void {
    this.currentPlayer = currentPlayer;
    this.turnPlayer = {
      name: this.currentPlayer.name,
      look: this.currentPlayer.look
    }
    this.newAttacks = this.currentPlayer.newAttacks;
    this.attacksList = this.currentPlayer.attackList;

    this.page.changeTurn();
  }

  changeRound(map: any, turnCounter: number, newFights: Array<Fight>): void {
    this.map = map;
    this.turnCounter = turnCounter;
    this.newFights = newFights;

    this.page.changeRound();
  }

  endGame(): void {
    this.page.endGame();
  }

  setSourcePlanet(planetName: string): void {
    if (!planetName) {
      this.attack.source = null;
      return;
    }

    planetName = planetName.toUpperCase();
    this.attack.source = this.getMapPlanets(this.map).find((p: Planet) =>
      p.name === planetName
    )
  }

  setDestinationPlanet(planetName: string): void {
    if (!planetName) {
      this.attack.destination = null;
      return;
    }

    planetName = planetName.toUpperCase();
    this.attack.destination = this.getMapPlanets(this.map).find((p: Planet) =>
      p.name === planetName
    )
  }

  selectPlanet(planetName: string): void {
    planetName = planetName.toUpperCase();
    const planet = this.getMapPlanets(this.map).find((p: Planet) =>
      p.name === planetName
    )

    if (this.options.interactMode === InteractMode.SingleTap) {
      // In single tap mode the planet selected is always used for the attack
      this.configureAttackPlanets(planet);
    } else if (this.options.interactMode === InteractMode.DoubleTap) {
      // In double tap mode initially the user focus the planet and then it is used for the attack
      if (this.attack.focus !== planet) {
        this.attack.focus = planet;
      } else {
        this.configureAttackPlanets(planet);
      }
    }
  }

  setShipCount(shipCount: number): void {
    this.attack.ships = Number(shipCount);
  }

  doAttack(): boolean {
    if (!this.attack.source || !this.attack.destination || !this.attack.ships || this.attack.source.owner !== this.currentPlayer) {
      console.debug('Impossibile iniziare l\'attacco: uno o più parametri mancanti');
      return false;
    }
    const { source, destination, ships } = this.attack;
    console.log(
      `Start attack from ${this.attack.source.name} to ${this.attack.destination.name} with ${this.attack.ships} ships.`,
      [source, destination, ships]
    );
    this.service.send('attack', {
      gameId: this.gameId,
      attack: { source, destination, ships },
    });
  }

  attackResponse(success: boolean): void {
    if (success) {
      const attackSourceCopy = this.getMapPlanets(this.map).find((p: Planet) =>
        p.name === this.attack.source.name
      );
      attackSourceCopy.fleet.removeShips(this.attack.ships);

      // Cleaning attack informations
      this.attack = { focus: null, source: null, destination: null, ships: null};
    }
    this.attackResponse(success);
  }

  cancelAttack(attack: AttackFleet): void {
    const attackSourceCopy = this.getMapPlanets(this.map).find((p: Planet) =>
      p.name === attack.source.name
    );
    attackSourceCopy.fleet.addShips(attack.shipCount);

    this.currentPlayer.cancelNewAttack(attack);
    this.newAttacks = this.currentPlayer.newAttacks;
  }

  endTurn(): boolean {
    /*let player = this.game.machine.currentState as Player;
    if (player instanceof LocalPlayer) {
      player.done();

      // Cleaning attack informations
      this.attack = { focus: null, source: null, destination: null, ships: null};
      return true;
    }*/
    return false;
  }

  private configureAttackPlanets(target: Planet): void {
    if (!target) {
      return;
    }

    if (this.attack.source == null) {
      // Il pianeta da cui parte l'attacco dev'essere di proprietà del giocatore
      if (target.owner.name === this.currentPlayer.name) {
        this.attack.source = target;
      }
    } else {
      // Il pianeta di destinazione non può essere uguale a quello di partenza
      if (this.attack.source !== target) {
        this.attack.destination = target;
      }
    }
  }

  private getMapPlanets(map: GameMap) {
    return map.grid
    .reduce((a, b) => a.concat(b))
    .filter(sector => sector.planet != null)
    .map(sector => sector.planet);
  }
}
