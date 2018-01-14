import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navController: NavController) {

  }

  startLocalGame(event: MouseEvent) {
    console.log('push AboutPage', event);
    this.navController.push(AboutPage)
  }

}
