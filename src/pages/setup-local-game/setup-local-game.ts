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

  constructor(public navController: NavController, public navParams: NavParams) {
    this.game = navParams.get('game');

    // Adding some data to the game
    let player1 = new LocalPlayer(this.game, 'Gioele', PlanetLook.One);
    this.game.addPlayer(player1);
    let player2 = new LocalPlayer(this.game, 'Linus', PlanetLook.Two);
    this.game.addPlayer(player2);
    this.game.model.map.addNeutralPlanetSomewhere(this.game.model.neutral);
    this.game.model.map.addPlayerPlanetSomewhere(player1);
    this.game.model.map.addPlayerPlanetSomewhere(player2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupLocalGamePage');
  }

  startLocalGame() {
    this.navController.push(PlayPage, {game: this.game});
  }
}
