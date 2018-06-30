//---------------------------------------------------------------------------
// class Sector
//---------------------------------------------------------------------------
import {Coordinate} from "./coordinate";
import {Planet} from "./planet";

export class Sector {
  public planet: Planet;

  constructor(readonly coordinate: Coordinate = new Coordinate(0, 0)) {
    this.planet = null;
  }

  // Crea una copia del settore in input
  clone(): Sector {
    const clone = new Sector(this.coordinate);
    clone.planet = this.planet.clone();
    return clone;
  }
}
