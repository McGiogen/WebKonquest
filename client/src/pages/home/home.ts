import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LocalGame, GameConfig} from 'webkonquest-core';
import {OptionsPage} from '../options/options';
import {AboutPage} from '../about/about';
import {SetupLocalGamePage} from '../setup-local-game/setup-local-game';
import {SetupRemoteGamePage} from '../setup-remote-game/setup-remote-game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navController: NavController) {

  }

  setupLocalGame() {
    this.navController.push(SetupLocalGamePage);
  }

  setupRemoteGame() {
    const game = new LocalGame(new GameConfig());
    this.navController.push(SetupRemoteGamePage, {game});
  }

  openAppOptions() {
    this.navController.push(OptionsPage);
  }

  openAbout() {
    this.navController.push(AboutPage);
  }
}
