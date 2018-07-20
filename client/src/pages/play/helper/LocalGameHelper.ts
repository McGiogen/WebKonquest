import {Planet, Player, LocalPlayer, GameEvent, GameMap, AttackFleet, Fight, GameConfig, LocalGame} from 'webkonquest-core';
import {AppOptions, InteractMode} from '../../../services/AppOptions';
import { GameHelper } from './GameHelper';
import { PlayPage } from '../play';
import { SetupGame, SetupPlayer } from '../../setup-game/SetupGameData';

export class LocalGameHelper implements GameHelper {
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
  private game: LocalGame

  constructor(private page: PlayPage) {
    this.options = AppOptions.instance;

    this.turnPlayer = { name: null, look: null };
    this.attack = { focus: null, source: null, destination: null, ships: null};
  }

  startGame(setup: SetupGame): void {
    const gameConfig = new GameConfig();
    if (setup.neutral.planets) {
      gameConfig.neutralPlanets = setup.neutral.planets;
    }
    this.game = new LocalGame(gameConfig);

    // Neutral player
    this.game.model.neutral.look = setup.neutral.look;
    // game.model.map.addNeutralPlanetSomewhere(game.model.neutral);

    // Adding some data to the game
    for (let i = 0; i < setup.players.length; i++) {
      const playerData = setup.players[i];

      // Human player
      const name = playerData.name || `Player ${i + 1}`;
      const player = new LocalPlayer(this.game, name);
      player.look = playerData.look;
      this.game.addPlayer(player);
      // game.model.map.addPlayerPlanetSomewhere(player);
    }

    this.game.model.map.populateMap(this.game.model.players, this.game.model.neutral, gameConfig.neutralPlanets);

    this.game.eventEmitter.on(GameEvent.RoundStart, this.changeRound.bind(this));
    this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.changeTurn.bind(this));
    this.game.eventEmitter.on(GameEvent.GameOver, this.endGame.bind(this));

    this.game.start();
  }

  changeTurn(): void {
    this.currentPlayer = this.game.machine.currentState as Player;
    this.turnPlayer = {
      name: this.currentPlayer.name,
      look: this.currentPlayer.look
    }
    this.newAttacks = this.currentPlayer.newAttacks;
    this.attacksList = this.currentPlayer.attackList;

    this.page.changeTurn();
  }

  changeRound(): void {
    this.map = this.game.model.map.clone();
    this.turnCounter = this.game.model.turnCounter;
    this.newFights = this.game.model.newFights;

    this.page.changeRound();
  }

  endGame(): void {
    this.winner = this.game.model.winner;
  }

  setSourcePlanet(planetName: string): void {
    if (!planetName) {
      this.attack.source = null;
      return;
    }

    planetName = planetName.toUpperCase();
    this.attack.source = this.game.model.map.getPlanets().find((p: Planet) =>
      p.name === planetName
    )
  }

  setDestinationPlanet(planetName: string): void {
    if (!planetName) {
      this.attack.destination = null;
      return;
    }

    planetName = planetName.toUpperCase();
    this.attack.destination = this.game.model.map.getPlanets().find((p: Planet) =>
      p.name === planetName
    )
  }

  selectPlanet(planetName: string): void {
    planetName = planetName.toUpperCase();
    const planet = this.game.model.map.getPlanets().find((p: Planet) =>
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
    this.attack.ships = shipCount;
  }

  doAttack(): boolean {
    if (!this.attack.source || !this.attack.destination || !this.attack.ships || this.attack.source.owner !== this.currentPlayer) {
      console.debug('Impossibile iniziare l\'attacco: uno o più parametri mancanti');
      return false;
    }
    console.log(
      `Start attack from ${this.attack.source.name} to ${this.attack.destination.name} with ${this.attack.ships} ships.`,
      [this.attack.source, this.attack.destination, Number(this.attack.ships)]
    );
    const success = this.game.attack(this.attack.source, this.attack.destination, Number(this.attack.ships), false);

    if (success) {
      const attackSourceCopy = this.map.getPlanets().find((p: Planet) =>
        p.name === this.attack.source.name
      );
      attackSourceCopy.fleet.removeShips(this.attack.ships);

      // Cleaning attack informations
      this.attack = { focus: null, source: null, destination: null, ships: null};
    }
    this.page.attackCompleted(success);
  }

  cancelAttack(attack: AttackFleet): void {
    const attackSourceCopy = this.map.getPlanets().find((p: Planet) =>
      p.name === attack.source.name
    );
    attackSourceCopy.fleet.addShips(attack.shipCount);

    this.currentPlayer.cancelNewAttack(attack);
    this.newAttacks = this.currentPlayer.newAttacks;
  }

  endTurn(): boolean {
    let player = this.game.machine.currentState as Player;
    if (player instanceof LocalPlayer) {
      player.done();

      // Cleaning attack informations
      this.attack = { focus: null, source: null, destination: null, ships: null};
      return true;
    }
    return false;
  }

  private configureAttackPlanets(target: Planet): void {
    if (!target) {
      return;
    }

    if (this.attack.source == null) {
      // Il pianeta da cui parte l'attacco dev'essere di proprietà del giocatore
      if (target.owner === this.currentPlayer) {
        this.attack.source = target;
      }
    } else {
      // Il pianeta di destinazione non può essere uguale a quello di partenza
      if (this.attack.source !== target) {
        this.attack.destination = target;
      }
    }
  }
}
