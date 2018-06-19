import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PlayPage} from '../play/play';
import {PLAYER_COLORS} from '../../services/playerColors';
import {LocalGame, LocalPlayer, GameConfig} from 'webkonquest-core';
import {AppOptions} from "../../services/AppOptions";

@Component({
  selector: 'page-setup-local-game',
  templateUrl: 'setup-local-game.html',
})
export class SetupLocalGamePage {
  private appOptions: AppOptions;
  private neutral: {name: string, look: string};
  private players: Array<{name: string, look: string}>;

  constructor(public navController: NavController) {
    this.appOptions = AppOptions.instance;
    this.neutral = { name: 'Neutral', look: PLAYER_COLORS[0] };
    this.players = [];
    this.addNewPlayer();
    this.addNewPlayer();
  }

  addNewPlayer(name = '', look?: string) {
    if (look == null) {
      for (let i = 1; i < PLAYER_COLORS.length && look == null; i++) {
        let color = PLAYER_COLORS[i];
        if (this.players.every(p => p.look !== color)) {
          look = color;
        }
      }
    }
    this.players.push({ name, look });
  }

  removePlayer(index) {
    this.players.splice(index, 1);
  }

  startLocalGame() {
    if (this.players.length < 2) {
      return;
    }

    const game = new LocalGame(new GameConfig());

    // Neutral player
    game.model.neutral.look = this.neutral.look;
    // game.model.map.addNeutralPlanetSomewhere(game.model.neutral);

    // Adding some data to the game
    for (let i = 0; i < this.players.length; i++) {
      const playerData = this.players[i];

      // Human player
      const name = playerData.name || `Player ${i + 1}`;
      const player = new LocalPlayer(game, name);
      player.look = playerData.look;
      game.addPlayer(player);
      // game.model.map.addPlayerPlanetSomewhere(player);
    }

    game.model.map.populateMap(game.model.players, game.model.neutral, game.model.configs.neutralPlanets);

    this.navController.push(PlayPage, {game});
  }

  focusInput(input): void {
    input.setFocus();
  }
}
