export interface PlayerLook {
  name: string;
  planetImage: string;
}

class PlayerLookFactory {
  static build(name: string, planetImage: string): PlayerLook {
    return {
      name,
      planetImage,
    }
  }
}

export const PLAYER_LOOK: PlayerLook[] = [
  PlayerLookFactory.build( 'One', 'planet1.png' ),
  PlayerLookFactory.build( 'Two', 'planet2.png' ),
  PlayerLookFactory.build( 'Three', 'planet3.png' )
];
