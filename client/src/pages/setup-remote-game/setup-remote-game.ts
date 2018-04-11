import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from '../play/play';
import {PLAYER_LOOK} from '../../services/playerLook';
import {LocalGame, LocalPlayer, Message} from 'webkonquest-core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Component({
  selector: 'page-setup-remote-game',
  templateUrl: 'setup-remote-game.html',
})
export class SetupRemoteGamePage {
  private game: LocalGame;
  private neutral: {name: string, look: number};
  private player: {name: string, look: number};
  private enemies: Array<{name: string, look: number}>;
  private planetImages: Array<string>;

  private socket$: WebSocketSubject<Message>;

  constructor(public navController: NavController, public navParams: NavParams) {
    this.initPlanetImages();

    this.game = navParams.get('game');
    this.enemies = [];
    this.neutral = { name: 'Neutral', look: 0 };
    this.player = { name: 'Player 0', look: 1 };

    this.socket$ = WebSocketSubject.create('ws://localhost:8080');
    this.socket$
      .subscribe(
        console.log,
        console.error,
        () => console.warn('Completed!')
      );
  }

  initPlanetImages() {
    const basePath = '/assets/imgs/planets/';
    this.planetImages = [];
    for (let i = 0; i < PLAYER_LOOK.length; i++) {
      const imageName = PLAYER_LOOK[i].planetImage;
      this.planetImages.push(basePath + imageName);
    }
  }

  addRemotePlayer(name = '', look?: number) {
    if (look == null) {
      for (let i = 0; i < PLAYER_LOOK.length && look == null; i++) {
        if (
          this.neutral.look !== i
          && this.player.look !== i
          && this.enemies.every(p => p.look !== i)
        ) {
          look = i;
        }
      }
    }
    this.enemies.push({ name, look });
  }

  removeRemotePlayer(index) {
    this.enemies.splice(index, 1);
  }

  startRemoteGame() {
    if (this.enemies.length < 3) {
      return;
    }

    // Neutral player
    const neutral = this.game.model.neutral;
    neutral.look = PLAYER_LOOK[this.neutral.look];
    this.game.model.map.addNeutralPlanetSomewhere(neutral);

    // Local player
    const name = this.player.name || 'Player 0';
    const player = new LocalPlayer(this.game, name);
    player.look = PLAYER_LOOK[this.player.look];
    this.game.addPlayer(player);
    this.game.model.map.addPlayerPlanetSomewhere(player);

    // Remote players
    for (let i = 0; i < this.enemies.length; i++) {
      const playerData = this.enemies[i];
      const name = playerData.name || `Player ${i}`;
      const player = new LocalPlayer(this.game, name);

      player.look = PLAYER_LOOK[playerData.look];
      this.game.addPlayer(player);
      this.game.model.map.addPlayerPlanetSomewhere(player);
    }

    this.navController.push(PlayPage, {game: this.game});
  }
}
