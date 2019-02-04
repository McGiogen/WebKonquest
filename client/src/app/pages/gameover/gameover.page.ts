import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-gameover',
  templateUrl: 'gameover.page.html',
  styleUrls: ['gameover.page.scss'],
})
export class GameoverPage {
  // Winner player's name
  winner: string;

  constructor(public activatedRoute: ActivatedRoute) {
    this.winner = activatedRoute.snapshot.queryParamMap.get('winner');
  }
}
