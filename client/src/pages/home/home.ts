import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LocalGame, GameConfig} from 'webkonquest-core';
import {OptionsPage} from '../options/options';
import {AboutPage} from '../about/about';
import {SetupLocalGamePage} from '../setup-local-game/setup-local-game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navController: NavController) {

  }

  setupLocalGame(event: MouseEvent) {
    const game = new LocalGame(new GameConfig());
    this.navController.push(SetupLocalGamePage, {game});
  }

  openAppOptions(event: MouseEvent) {
    this.navController.push(OptionsPage);
  }

  openAbout(event: MouseEvent) {
    this.navController.push(AboutPage);
  }

}
