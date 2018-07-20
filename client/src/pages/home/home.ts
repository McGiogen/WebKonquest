import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {OptionsPage} from '../options/options';
import {AboutPage} from '../about/about';
import {SetupGamePage} from '../setup-game/setup-game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public isOnline: boolean;

  constructor(public navController: NavController) {
    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = navigator.onLine;
    });

    window.addEventListener('offline', () => {
      this.isOnline = navigator.onLine;
    })
  }

  ionViewDidEnter() {
    this.isOnline = navigator.onLine;
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
