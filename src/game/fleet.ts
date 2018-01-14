//---------------------------------------------------------------------------
// class Fleet
//   \---class AttackFleet
//    \---class DefenseFleet
//---------------------------------------------------------------------------

import {Planet} from "./planet";
import {Player} from "./player";

export class Fleet {
  constructor(protected _shipCount: number) {
  }

  removeShips(lostShips: number) {
    this._shipCount -= lostShips;
  }

  get shipCount() {
    return this._shipCount;
  }
}

export class AttackFleet extends Fleet {
  readonly owner: Player;

  constructor(readonly source: Planet, readonly destination: Planet, protected _shipCount: number, public arrivalTurn: number) {
    super(_shipCount);
    this.owner = source.owner;
  }
}

// TODO estrai la logica
export class DefenseFleet extends Fleet {
  constructor(protected _home: Planet, protected _shipCount: number) {
    super(_shipCount);
  }

  absorb(attackFleet) {
    this._shipCount += attackFleet.shipCount;
  }

  become(attackFleet) {
    this._shipCount = attackFleet.shipCount;
  }

  spawnAttackFleet(destination, shipCount, arrivalTurn) {
    if (this._shipCount < shipCount) {
      // Non ci sono abbastanza navi per l'attacco
      return null;
    }

    const newAttackFleet = new AttackFleet(this._home, destination, shipCount, arrivalTurn);

    this.removeShips(shipCount);

    // emit update();

    return newAttackFleet;
  }

  addShips(shipCount) {
    this._shipCount += shipCount;

    if (this._shipCount < 0) { /* to allow for negative production planets */
      this._shipCount = 0;
    }
  }
}
