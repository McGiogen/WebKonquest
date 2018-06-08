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

const COLORS = [ 'grey', 'blue', 'red', 'green', 'yellow', 'orange', 'cyan', 'lime', 'pink', 'beige', 'navy'];
const PLAYER_LOOK: PlayerLook[] = [];
for (let color of COLORS) {
  PLAYER_LOOK.push(PlayerLookFactory.build( color, `planet-${color}.png` ));
}
export { PLAYER_LOOK };
