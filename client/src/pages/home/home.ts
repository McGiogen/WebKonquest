import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {OptionsPage} from "../options/options";
import {AboutPage} from "../about/about";
import {LocalGame} from "../../game/localgame";
import {GameConfig} from "../../game/config";
import {SetupLocalGamePage} from "../setup-local-game/setup-local-game";

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
