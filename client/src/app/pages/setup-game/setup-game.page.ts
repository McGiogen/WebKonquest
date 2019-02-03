import {Component} from '@angular/core';
import {PLAYER_COLORS} from '../../services/playerColors';
import {AppOptions} from '../../services/AppOptions';
import { SetupNeutral, SetupPlayer, SetupGame } from './SetupGameData';
import { GameConfig } from 'webkonquest-core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'page-setup-game',
  templateUrl: 'setup-game.page.html',
  styles: ['setup-game.page.scss'],
})
export class SetupGamePage {
  neutral: SetupNeutral;
  players: Array<SetupPlayer>;
  local: boolean;
  gameConfig: GameConfig;
  appOptions: AppOptions;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.gameConfig = new GameConfig();
    this.appOptions = AppOptions.instance;

    this.local = (this.activatedRoute.snapshot.queryParamMap.get('local') !== 'false');
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
    };

    this.router.navigate(['/play'], {queryParams: {setupGame}});
  }

  focusInput(input): void {
    input.setFocus();
  }
}
