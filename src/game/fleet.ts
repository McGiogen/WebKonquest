//---------------------------------------------------------------------------
// class Fleet
//   \---class AttackFleet
//    \---class DefenseFleet
//---------------------------------------------------------------------------

import {Planet} from "./planet";
import {Player} from "./player";

export class Fleet {
  constructor(public shipCount: number) {
  }

  removeShips(lostShips: number): void {
    this.shipCount -= lostShips;
  }
}

export class AttackFleet extends Fleet {
  readonly owner: Player;

  constructor(readonly source: Planet, readonly destination: Planet, shipCount: number, public arrivalTurn: number) {
    super(shipCount);
    this.owner = source.owner;
  }
}

// TODO estrai la logica
export class DefenseFleet extends Fleet {
  constructor(protected _home: Planet, shipCount: number) {
    super(shipCount);
  }

  absorb(attackFleet: AttackFleet): void {
    this.shipCount += attackFleet.shipCount;
  }

  become(attackFleet: AttackFleet): void {
    this.shipCount = attackFleet.shipCount;
  }

  spawnAttackFleet(destination: Planet, shipCount: number, arrivalTurn: number): AttackFleet {
    if (this.shipCount < shipCount) {
      // Non ci sono abbastanza navi per l'attacco
      return null;
    }

    const newAttackFleet = new AttackFleet(this._home, destination, shipCount, arrivalTurn);

    this.removeShips(shipCount);

    // emit update();

    return newAttackFleet;
  }

  addShips(shipCount: number): void {
    this.shipCount += shipCount;

    if (this.shipCount < 0) { /* to allow for negative production planets */
      this.shipCount = 0;
    }
  }
}
