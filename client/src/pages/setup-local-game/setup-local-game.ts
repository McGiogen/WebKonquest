import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from '../play/play';
import {PLAYER_COLORS} from '../../services/playerColors';
import {LocalGame, LocalPlayer} from 'webkonquest-core';
import {AppOptions} from "../../services/AppOptions";

@Component({
  selector: 'page-setup-local-game',
  templateUrl: 'setup-local-game.html',
})
export class SetupLocalGamePage {
  private appOptions: AppOptions;
  private game: LocalGame;
  private neutral: {name: string, look: string};
  private players: Array<{name: string, look: string}>;

  constructor(public navController: NavController, public navParams: NavParams) {
    this.appOptions = AppOptions.instance;
    this.game = navParams.get('game');
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

    // Neutral player
    const neutral = this.game.model.neutral;
    neutral.look = this.neutral.look;
    // this.game.model.map.addNeutralPlanetSomewhere(neutral);

    // Adding some data to the game
    for (let i = 0; i < this.players.length; i++) {
      const playerData = this.players[i];

      // Human player
      const name = playerData.name || `Player ${i + 1}`;
      const player = new LocalPlayer(this.game, name);
      player.look = playerData.look;
      this.game.addPlayer(player);
      // this.game.model.map.addPlayerPlanetSomewhere(player);
    }

    this.game.model.map.clearMap();
    this.game.model.map.populateMap(this.game.model.players, this.game.model.neutral, 3);

    this.navController.push(PlayPage, {game: this.game});
  }
}
