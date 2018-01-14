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
    clone.planet = this.planet;
    return clone;
  }

  // setPlanet(planet: Planet) {
  // 	this.planet = planet;
  //
  // 	// connect
  // 	// connect(m_planet, &Planet::update, this, &Sector::childPlanetUpdate);
  //
  // 	// emit update();
  // }

  removePlanet() {
    this.planet = null;

    // emit update();
  }

  // childPlanetUpdate() {
  // emit update();
  // }
}

// TODO usare clone()?
/*Sector &
Sector::operator=( const Sector &other )
{
    m_coord  = other.m_coord;
    m_planet = other.m_planet;

    return *this;
}*/
