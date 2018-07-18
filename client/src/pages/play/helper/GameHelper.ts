import {Planet, Player, GameMap, AttackFleet} from 'webkonquest-core';
import {AppOptions} from '../../../services/AppOptions';
import { SetupGame } from '../../setup-game/SetupGameData';
import { Injectable } from '@angular/core';

export interface GameHelper {
  options: AppOptions;

  currentPlayer: Player;

  attack: {focus: Planet, source: Planet, destination: Planet, ships: number };

  turnCounter: number;
  turnPlayer: { name: string, look: string };
  winner: { name: string, look: string };

  newAttacks: Array<AttackFleet>;
  attacksList: Array<AttackFleet>;

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