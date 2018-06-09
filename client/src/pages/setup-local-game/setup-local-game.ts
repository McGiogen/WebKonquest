import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from '../play/play';
import {PLAYER_COLORS} from '../../services/playerColors';
import {LocalGame, LocalPlayer} from 'webkonquest-core';

@Component({
  selector: 'page-setup-local-game',
  templateUrl: 'setup-local-game.html',
})
export class SetupLocalGamePage {
  private game: LocalGame;
  private players: Array<{name: string, look: string, neutral: boolean}>;

  constructor(public navController: NavController, public navParams: NavParams) {
    this.game = navParams.get('game');
    this.players = [];
    this.addNewPlayer(true,'Neutral');
    this.addNewPlayer();
    this.addNewPlayer();
  }

  addNewPlayer(neutral = false, name = '', look?: string) {
    if (look == null) {
      for (let i = 0; i < PLAYER_COLORS.length && look == null; i++) {
        let color = PLAYER_COLORS[i];
        if (this.players.every(p => p.look !== color)) {
          look = color;
        }
      }
    }
    this.players.push({ name, look, neutral });
  }

  removePlayer(index) {
    this.players.splice(index, 1);
  }

  startLocalGame() {
    if (this.players.length < 3) {
      return;
    }

    // Adding some data to the game
    for (let i = 0; i < this.players.length; i++) {
      const playerData = this.players[i];
      const look = playerData.look;

      if (playerData.neutral) {
        // Neutral player
        const neutral = this.game.model.neutral;
        neutral.look = look;
        this.game.model.map.addNeutralPlanetSomewhere(neutral);
      } else {
        // Human player
        const name = playerData.name || `Player ${i}`;
        const player = new LocalPlayer(this.game, name);
        player.look = look;
        this.game.addPlayer(player);
        this.game.model.map.addPlayerPlanetSomewhere(player);
      }
    }

    this.navController.push(PlayPage, {game: this.game});
  }
}
