import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlayPage } from '../play/play';
import {OptionsPage} from "../options/options";
import {AboutPage} from "../about/about";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navController: NavController) {

  }

  startLocalGame(event: MouseEvent) {
    this.navController.push(PlayPage);
  }

  openAppOptions(event: MouseEvent) {
    this.navController.push(OptionsPage);
  }

  openAbout(event: MouseEvent) {
    this.navController.push(AboutPage);
  }

}
