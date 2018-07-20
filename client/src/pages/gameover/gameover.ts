import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
