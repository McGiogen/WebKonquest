import {Game} from "../../game/game";
import {GameOptions, InteractMode} from "../../services/GameOptions";
import {Planet} from "../../game/planet";
import {Player} from "../../game/player";
import {LocalPlayer} from "../../game/localplayer";

export class LocalGameHelper {
  planetWithFocus: Planet;

  attackSource: Planet;
  attackDestination: Planet;
  attackShipCount: number;

  constructor(private game: Game, private options: GameOptions) {}

  selectPlanet(planet: Planet): void {
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
    this.configureAttackShipCount(shipCount);
  }

  doAttack(): void {
    if (!this.attackSource || !this.attackDestination || this.attackShipCount == null) {
      throw new Error('Impossibile iniziare l\'attacco: uno o più parametri mancanti');
    }
    this.game.attack(this.attackSource, this.attackDestination, this.attackShipCount, false);

    // Cleaning attack informations
    this.attackSource = null;
    this.attackDestination = null;
    this.attackShipCount = null;
  }

  endTurn(): void {
    let player = this.game.machine.currentState as Player;
    if (player instanceof LocalPlayer) {
      player.done();

      // Cleaning attack informations
      this.attackSource = null;
      this.attackDestination = null;
      this.attackShipCount = null;
    }
  }

  private configureAttackPlanets(target: Planet): void {
    if (!target) {
      return;
    }
    let currentPlayer = this.game.machine.currentState as Player;
    if (this.attackSource == null) {
      // Il pianeta da cui parte l'attacco dev'essere di proprietà del giocatore
      if (target.owner === currentPlayer) {
        this.attackSource = target;
      }
    } else {
      // Il pianeta di destinazione non può essere uguale a quello di partenza
      if (this.attackSource !== target) {
        this.attackDestination = target;
      }
    }
  }

  private configureAttackShipCount(shipCount: number): void {
    this.attackShipCount = shipCount;
  }
}
