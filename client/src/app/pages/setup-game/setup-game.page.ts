import {Component, OnInit} from '@angular/core';
import {PLAYER_COLORS} from '../../services/playerColors';
import {AppOptions} from '../../services/AppOptions';
import { SetupNeutral, SetupPlayer, SetupGame } from './SetupGameData';
import { GameConfig } from 'webkonquest-core';
import {ActivatedRoute, Router} from '@angular/router';
import { TempStorageService } from 'src/app/services/temp-storage.service';

@Component({
  selector: 'page-setup-game',
  templateUrl: 'setup-game.page.html',
  styleUrls: ['setup-game.page.scss'],
})
export class SetupGamePage implements OnInit {
  neutral: SetupNeutral;
  players: Array<SetupPlayer>;
  local: boolean;
  gameConfig: GameConfig;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tempStorage: TempStorageService,
    public appOptions: AppOptions,
    ) {}

  ngOnInit() {
    this.gameConfig = new GameConfig();

    this.local = (this.activatedRoute.snapshot.queryParamMap.get('local') !== 'false');
    this.neutral = { name: 'Neutral', look: PLAYER_COLORS[0], planets: null };
    this.players = [];
    this.addNewPlayer();
    this.addNewPlayer();
  }

  addNewPlayer(name = '', look?: string) {
    if (look == null) {
      for (let i = 1; i < PLAYER_COLORS.length && look == null; i++) {
        const color = PLAYER_COLORS[i];
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
    this.tempStorage.setupGame = {
      players: this.players,
      neutral: this.neutral,
      local: this.local,
    };

    this.router.navigate(['/play']);
  }

  focusInput(input): void {
    input.setFocus();
  }
}
