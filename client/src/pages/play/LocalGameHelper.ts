import {Game, Planet, Player, LocalPlayer, GameEvent, GameMap, AttackFleet, Fight} from 'webkonquest-core';
import {AppOptions, InteractMode} from '../../services/AppOptions';
import { GameHelper } from './GameHelper';
import { PlayPage } from './play';

export class LocalGameHelper implements GameHelper {
  options: AppOptions;

  currentPlayer: Player;

  attack: {focus: Planet, source: Planet, destination: Planet, ships: number };

  turnCounter: number;
  turnPlayer: { name: string, look: string };

  newAttacks: Array<AttackFleet>;
  attacksList: Array<AttackFleet>;
  newFights: Array<Fight>;

  map: GameMap;

  constructor(private game: Game, private page: PlayPage) {
    this.options = AppOptions.instance;

    this.turnPlayer = { name: null, look: null };
    this.attack = { focus: null, source: null, destination: null, ships: null};
  }

  startGame() {
    this.game.eventEmitter.on(GameEvent.RoundStart, this.changeRound.bind(this));
    this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.changeTurn.bind(this));

    this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.page.changeTurn.bind(this.page));
    this.game.eventEmitter.on(GameEvent.RoundStart, this.page.changeRound.bind(this.page));
    this.game.eventEmitter.on(GameEvent.GameOver, this.page.endGame.bind(this.page));

    this.game.start();
  }

  changeTurn() {
    this.currentPlayer = this.game.machine.currentState as Player;
    this.turnPlayer = {
      name: this.currentPlayer.name,
      look: this.currentPlayer.look
    }
    this.newAttacks = this.currentPlayer.newAttacks;
    this.attacksList = this.currentPlayer.attackList;
  }

  changeRound() {
    this.map = this.game.model.map.clone();
    this.turnCounter = this.game.model.turnCounter;
    this.newFights = this.game.model.newFights;
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

  setShipCount(shipCount: number) {
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
    return success;
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
