import {Game, Planet, Player, LocalPlayer, GameEvent, GameMap, AttackFleet} from 'webkonquest-core';
import {AppOptions, InteractMode} from '../../services/AppOptions';

export class LocalGameHelper {
  planetWithFocus: Planet;
  options: AppOptions;

  currentPlayer: Player;

  attackSource: Planet;
  attackDestination: Planet;
  attackShipCount: number;

  map: GameMap;

  constructor(private game: Game) {
    this.options = AppOptions.instance;
    this.game.eventEmitter.on(GameEvent.RoundStart, this.changeRound.bind(this));
    this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.changeTurn.bind(this));
  }

  startGame() {
    this.game.start();
  }

  changeTurn() {
    this.currentPlayer = this.game.machine.currentState as Player;
  }

  changeRound() {
    this.map = this.game.model.map.clone();
  }

  setSourcePlanet(planetName: string): void {
    if (!planetName) {
      this.attackSource = null;
      return;
    }

    planetName = planetName.toUpperCase();
    this.attackSource = this.game.model.map.getPlanets().find((p: Planet) =>
      p.name === planetName
    )
  }

  setDestinationPlanet(planetName: string): void {
    if (!planetName) {
      this.attackDestination = null;
      return;
    }

    planetName = planetName.toUpperCase();
    this.attackDestination = this.game.model.map.getPlanets().find((p: Planet) =>
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
      if (this.planetWithFocus !== planet) {
        this.planetWithFocus = planet;
      } else {
        this.configureAttackPlanets(planet);
      }
    }
  }

  setShipCount(shipCount: number) {
    this.attackShipCount = shipCount;
  }

  doAttack(): boolean {
    if (!this.attackSource || !this.attackDestination || !this.attackShipCount || this.attackSource.owner !== this.currentPlayer) {
      console.debug('Impossibile iniziare l\'attacco: uno o più parametri mancanti');
      return false;
    }
    console.log(`Start attack from ${this.attackSource.name} to ${this.attackDestination.name} with ${this.attackShipCount} ships.`, [this.attackSource, this.attackDestination, Number(this.attackShipCount)]);
    const success = this.game.attack(this.attackSource, this.attackDestination, Number(this.attackShipCount), false);

    if (success) {
      const attackSourceCopy = this.map.getPlanets().find((p: Planet) =>
        p.name === this.attackSource.name
      );
      attackSourceCopy.fleet.removeShips(this.attackShipCount);

      // Cleaning attack informations
      this.attackSource = null;
      this.attackDestination = null;
      this.attackShipCount = null;
    }
    return success;
  }

  cancelAttack(attack: AttackFleet): void {
    const attackSourceCopy = this.map.getPlanets().find((p: Planet) =>
      p.name === attack.source.name
    );
    attackSourceCopy.fleet.addShips(attack.shipCount);

    this.currentPlayer.cancelNewAttack(attack);
  }

  endTurn(): boolean {
    let player = this.game.machine.currentState as Player;
    if (player instanceof LocalPlayer) {
      player.done();

      // Cleaning attack informations
      this.attackSource = null;
      this.attackDestination = null;
      this.attackShipCount = null;
      return true;
    }
    return false;
  }

  private configureAttackPlanets(target: Planet): void {
    if (!target) {
      return;
    }

    if (this.attackSource == null) {
      // Il pianeta da cui parte l'attacco dev'essere di proprietà del giocatore
      if (target.owner === this.currentPlayer) {
        this.attackSource = target;
      }
    } else {
      // Il pianeta di destinazione non può essere uguale a quello di partenza
      if (this.attackSource !== target) {
        this.attackDestination = target;
      }
    }
  }
}
