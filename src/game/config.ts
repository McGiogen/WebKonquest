export class GameConfig {
  mapWidth: number = 10;
  mapHeight: number = 10;
  neutralPlanets: 3;
  blindMap: boolean = false;
  cumulativeProduction: boolean = false;
  productionAfterConquere: boolean = true;
  neutralsShowShips: boolean = false;
  neutralsShowStats: boolean = false;
  neutralsProduction: number = 1;

  constructor() {};
}
