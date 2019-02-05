import {Planet, Player, GameMap, AttackFleet, Fight} from 'webkonquest-core';
import {AppOptions} from '../../../services/AppOptions';
import { SetupGame } from '../../setup-game/SetupGameData';

export interface GameHelper {
  options: AppOptions;

  currentPlayer: Player;

  attack: {focus: Planet, source: Planet, destination: Planet, ships: number };

  turnCounter: number;
  turnPlayer: { name: string, look: string };
  winner: { name: string, look: string };

  newAttacks: Array<AttackFleet>;
  attacksList: Array<AttackFleet>;
  newFights: Array<Fight>;

  map: GameMap;

  startGame(setup: SetupGame);

  setSourcePlanet(planetName: string): void;

  setDestinationPlanet(planetName: string): void;

  selectPlanet(planetName: string): void;

  setShipCount(shipCount: number);

  doAttack(): boolean;

  cancelAttack(attack: AttackFleet): void;

  endTurn(): boolean;
}
