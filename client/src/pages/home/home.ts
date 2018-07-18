import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {OptionsPage} from '../options/options';
import {AboutPage} from '../about/about';
import {SetupGamePage} from '../setup-game/setup-game';
import { GameServerService } from '../play/helper/gameserver.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navController: NavController/*, private service: GameServerService*/) {

  }

  setupLocalGame() {
    this.navController.push(SetupGamePage, {local: true});
  }

  setupRemoteGame() {
    this.navController.push(SetupGamePage, {local: false});
  }

  openAppOptions() {
    this.navController.push(OptionsPage);
  }

  openAbout() {
    this.navController.push(AboutPage);
  }
}
