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
  // Winner player's name
  private winner: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.winner = navParams.get('winner');
  }

  goToHome() {
    this.navCtrl.goToRoot({});
  }
}
