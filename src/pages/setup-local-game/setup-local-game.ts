import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from "../play/play";
import {LocalGame} from "../../game/localgame";
import {PlanetLook} from "../../game/planet";
import {LocalPlayer} from "../../game/localplayer";

/**
 * Generated class for the SetupLocalGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-setup-local-game',
  templateUrl: 'setup-local-game.html',
})
export class SetupLocalGamePage {
  private game: LocalGame;
  private players: Array<{name: string, look: number}>;
  private planetImages: Array<string>;

  constructor(public navController: NavController, public navParams: NavParams) {
    this.initPlanetImages();

    this.game = navParams.get('game');
    this.players = [];
    this.addNewPlayer();
    this.addNewPlayer();
  }

  initPlanetImages() {
    const basePath = '/assets/imgs/planets/';
    this.planetImages = [];
    for (let i = 0; i < 18; i++) {
      const imageName = `planet${i + 1}.png`;
      this.planetImages.push(basePath + imageName);
    }
  }

  addNewPlayer() {
    this.players.push({ name: '', look: 0 });
  }

  updatePlanetLook(playerIndex: number, look: number) {
    this.players[playerIndex].look = look;
  }

  startLocalGame() {
    // Adding some data to the game
    for (let playerData of this.players) {
      const player = new LocalPlayer(this.game, playerData.name, playerData.look + 1);
      this.game.addPlayer(player);
      this.game.model.map.addPlayerPlanetSomewhere(player);
    }
    this.game.model.map.addNeutralPlanetSomewhere(this.game.model.neutral);

    this.navController.push(PlayPage, {game: this.game});
  }
}
