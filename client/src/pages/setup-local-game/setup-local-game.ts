import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from '../play/play';
import {PLAYER_LOOK} from '../../services/playerLook';
import {LocalGame, LocalPlayer} from 'webkonquest-core';

@Component({
  selector: 'page-setup-local-game',
  templateUrl: 'setup-local-game.html',
})
export class SetupLocalGamePage {
  private game: LocalGame;
  private players: Array<{name: string, look: number, neutral: boolean}>;
  private planetImages: Array<string>;

  constructor(public navController: NavController, public navParams: NavParams) {
    this.initPlanetImages();

    this.game = navParams.get('game');
    this.players = [];
    this.addNewPlayer(true,'Neutral');
    this.addNewPlayer();
    this.addNewPlayer();
  }

  initPlanetImages() {
    const basePath = '/assets/imgs/planets/';
    this.planetImages = [];
    for (let i = 0; i < PLAYER_LOOK.length; i++) {
      const imageName = PLAYER_LOOK[i].planetImage;
      this.planetImages.push(basePath + imageName);
    }
  }

  addNewPlayer(neutral = false, name = '', look?: number) {
    if (look == null) {
      for (let i = 0; i < PLAYER_LOOK.length && look == null; i++) {
        if (this.players.every(p => p.look !== i)) {
          look = i;
        }
      }
    }
    this.players.push({ name, look, neutral });
  }

  removePlayer(index) {
    this.players.splice(index, 1);
  }

  updatePlayerLook(playerIndex: number, look: number) {
    this.players[playerIndex].look = look;
  }

  startLocalGame() {
    if (this.players.length < 3) {
      return;
    }

    // Adding some data to the game
    for (let i = 0; i < this.players.length; i++) {
      const playerData = this.players[i];
      const look = PLAYER_LOOK[playerData.look];

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
