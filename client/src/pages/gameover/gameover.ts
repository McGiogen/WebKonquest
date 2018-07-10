import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Player } from 'webkonquest-core';

/**
 * Generated class for the GameoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-gameover',
  templateUrl: 'gameover.html',
})
export class GameoverPage {
  private winner: Player;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.winner = navParams.get('game').model.winner;
  }

  goToHome() {
    this.navCtrl.goToRoot({});
  }
}
