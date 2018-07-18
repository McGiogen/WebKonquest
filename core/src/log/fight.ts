import {AttackFleet, DefenseFleet} from "../fleet";
import {Player} from "../player";
import {Planet} from "../planet";

export class Fight {
  public attacker: Player;
  public defender: Player;
  public attackerPlanet: Planet;
  public defenderPlanet: Planet;
  public winner: Player;
  public attackerShips: number;
  public defenderShips: number;
  public winnerShips: number;

  constructor(attackerFleet: AttackFleet, defenderFleet: DefenseFleet, public turn: number) {
    this.attacker = attackerFleet.owner;
    this.attackerPlanet = attackerFleet.source;
    this.defenderPlanet = attackerFleet.destination;
    this.defender = this.defenderPlanet.owner;
    this.attackerShips = attackerFleet.shipCount;
    this.defenderShips = defenderFleet.shipCount;

    if (this.attacker === this.defender) {
      this.winner = this.attacker;
      this.winnerShips = this.attackerShips + this.defenderShips;
    }
  }

  public setWinner(winner: Player, winnerShips: number) {
    this.winner = winner;
    this.winnerShips = winnerShips;
  }
}
