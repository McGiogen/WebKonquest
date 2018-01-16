import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PlayPage } from '../play/play';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navController: NavController) {

  }

  startLocalGame(event: MouseEvent) {
    console.log('push PlayPage', event);
    this.navController.push(PlayPage)
  }

}
