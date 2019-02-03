export interface SetupGame {
  neutral: SetupNeutral;
  players: Array<SetupPlayer>;
  local: boolean;
}

export interface SetupPlayer {
  name: string;
  look: string;
}

export interface SetupNeutral extends SetupPlayer {
  planets: number;
}