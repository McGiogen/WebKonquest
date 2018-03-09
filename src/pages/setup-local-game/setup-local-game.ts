import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from "../play/play";
import {LocalGame} from "../../game/localgame";
import {PLAYER_LOOK} from "../../game/playerLook";
import {LocalPlayer} from "../../game/localplayer";

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

  updatePlayerLook(playerIndex: number, look: number) {
    this.players[playerIndex].look = look;
  }

  startLocalGame() {
    // Adding some data to the game
    for (let playerData of this.players) {
      const player = new LocalPlayer(this.game, playerData.name, PLAYER_LOOK[playerData.look]);
      this.game.addPlayer(player);
      this.game.model.map.addPlayerPlanetSomewhere(player);
    }
    this.game.model.map.addNeutralPlanetSomewhere(this.game.model.neutral);

    this.navController.push(PlayPage, {game: this.game});
  }
}
