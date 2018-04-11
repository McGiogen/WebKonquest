import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LocalGame, gameEmitter, GameEvent} from 'webkonquest-core';
import {LocalGameHelper} from './LocalGameHelper';
import {AppOptions} from '../../services/AppOptions';
import {GameoverPage} from '../gameover/gameover';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  private game: LocalGame;
  private helper: LocalGameHelper;
  private appOptions: AppOptions;

  constructor(public navController: NavController, navParams: NavParams) {
    this.appOptions = AppOptions.instance;
    this.game = navParams.get('game');
    this.helper = new LocalGameHelper(this.game);

    gameEmitter.on(GameEvent.GameOver, this.endGame.bind(this));

    this.game.start();
  }

  mapSelectedSector(sector) {
    console.debug('Settore selezionato: ', sector);
    if (sector) {
      this.helper.selectPlanet(sector.planet);
    }
  }

  playerInTurn(): string {
    let curState = this.game.machine.currentState;
    if (curState) {
      return curState.toString();
    }
    return '';
  }

  attack(): void {
    this.helper.doAttack();
  }

  endTurn(): void {
    this.helper.endTurn();
  }

  endGame(): void {
    this.navController.push(GameoverPage);
  }
}