import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LocalGame, GameEvent} from 'webkonquest-core';
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

  private showTurnSwitch: boolean;

  constructor(public navController: NavController, navParams: NavParams) {
    this.appOptions = AppOptions.instance;
    this.game = navParams.get('game');
    this.helper = new LocalGameHelper(this.game);

    this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.changeTurn.bind(this));
    this.game.eventEmitter.on(GameEvent.GameOver, this.endGame.bind(this));

    this.helper.startGame();
    this.showTurnSwitch = true;
  }

  mapSelectedSector(sector) {
    if (sector && sector.planet) {
      console.debug('Pianeta selezionato: ', sector.planet);
      this.helper.selectPlanet(sector.planet);
    }
  }

  changeTurn(): void {
    this.showTurnSwitch = true;
  }

  playerInTurn(): string {
    let curState = this.game.machine.currentState;
    if (!curState) {
      return '';
    }
    return curState.toString();
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
