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

const PLAYER_LOOK: PlayerLook[] = [];
for (let i = 1; i <= 18; i++) {
  PLAYER_LOOK.push(PlayerLookFactory.build( i + '', `planet${i}.png` ));
}
export { PLAYER_LOOK };
