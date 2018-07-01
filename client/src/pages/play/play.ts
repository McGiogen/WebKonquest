import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LocalGame, GameEvent, AttackFleet} from 'webkonquest-core';
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

  view: string; // 'change-round', 'change-turn', 'game'

  constructor(public navController: NavController, navParams: NavParams) {
    this.appOptions = AppOptions.instance;
    this.game = navParams.get('game');
    this.helper = new LocalGameHelper(this.game);

    this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.changeTurn.bind(this));
    this.game.eventEmitter.on(GameEvent.RoundStart, this.changeRound.bind(this));
    this.game.eventEmitter.on(GameEvent.GameOver, this.endGame.bind(this));

    this.helper.startGame();
    this.view = 'change-round';
  }

  mapSelectedSector(sector) {
    if (sector && sector.planet) {
      console.debug('Pianeta selezionato: ', sector.planet);
      this.helper.selectPlanet(sector.planet);
    }
  }

  changeTurn(): void {
    if (this.view !== 'change-round') {
      this.view = 'change-turn';
    }
  }

  changeRound(): void {
    this.view = 'change-round';
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

  cancelAttack(attack: AttackFleet): void {
    this.helper.cancelAttack(attack);
  }

  endTurn(): void {
    this.helper.endTurn();
  }

  endGame(): void {
    this.navController.push(GameoverPage);
  }
}
