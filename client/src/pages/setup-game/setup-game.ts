import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from '../play/play';
import {PLAYER_COLORS} from '../../services/playerColors';
import {AppOptions} from "../../services/AppOptions";
import { SetupNeutral, SetupPlayer, SetupGame } from './SetupGameData';
import { GameConfig } from 'webkonquest-core';

@Component({
  selector: 'page-setup-game',
  templateUrl: 'setup-game.html',
})
export class SetupGamePage {
  private appOptions: AppOptions;
  private neutral: SetupNeutral;
  private players: Array<SetupPlayer>;
  private local: boolean;
  gameConfig: GameConfig;

  constructor(public navController: NavController, private navParams: NavParams) {
  }

  ngOnInit() {
    this.gameConfig = new GameConfig();
    this.appOptions = AppOptions.instance;
    this.local = this.navParams.get('local');
    this.neutral = { name: 'Neutral', look: PLAYER_COLORS[0], planets: null };
    this.players = [];
    this.addNewPlayer();
    this.addNewPlayer();
  }

  addNewPlayer(name = '', look?: string) {
    if (look == null) {
      for (let i = 1; i < PLAYER_COLORS.length && look == null; i++) {
        let color = PLAYER_COLORS[i];
        if (this.players.every(p => p.look !== color)) {
          look = color;
        }
      }
    }
    this.players.push({ name, look });
  }

  removePlayer(index) {
    this.players.splice(index, 1);
  }

  startLocalGame() {
    if (this.players.length < 2) {
      return;
    }
    const setupGame: SetupGame = {
      players: this.players,
      neutral: this.neutral,
      local: this.local,
    }

    this.navController.push(PlayPage, {setupGame});
  }

  focusInput(input): void {
    input.setFocus();
  }
}
