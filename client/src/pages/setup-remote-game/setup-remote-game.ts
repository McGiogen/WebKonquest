import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {PlayPage} from '../play/play';
import {PLAYER_COLORS} from '../../services/playerColors';
import {LocalGame, LocalPlayer, Message} from 'webkonquest-core';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Component({
  selector: 'page-setup-remote-game',
  templateUrl: 'setup-remote-game.html',
})
export class SetupRemoteGamePage {
  private game: LocalGame;
  private neutral: {name: string, look: string};
  private player: {name: string, look: string};
  private enemies: Array<{name: string, look: string}>;

  private socket$: WebSocketSubject<Message>;

  constructor(public navController: NavController, public navParams: NavParams) {
    this.game = navParams.get('game');
    this.enemies = [];
    this.neutral = { name: 'Neutral', look: PLAYER_COLORS[0] };
    this.player = { name: 'Player 0', look: PLAYER_COLORS[1] };

    this.socket$ = WebSocketSubject.create('ws://localhost:8080');
    this.socket$
      .subscribe(
        console.log,
        console.error,
        () => console.warn('Completed!')
      );
  }

  addRemotePlayer(name = '', look?: string) {
    if (look == null) {
      for (let i = 0; i < PLAYER_COLORS.length && look == null; i++) {
        let color = PLAYER_COLORS[i];
        if (
          this.neutral.look !== color
          && this.player.look !== color
          && this.enemies.every(p => p.look !== color)
        ) {
          look = PLAYER_COLORS[i];
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
    neutral.look = this.neutral.look;
    this.game.model.map.addNeutralPlanetSomewhere(neutral);

    // Local player
    const name = this.player.name || 'Player 1';
    const player = new LocalPlayer(this.game, name);
    player.look = this.player.look;
    this.game.addPlayer(player);
    this.game.model.map.addPlayerPlanetSomewhere(player);

    // Remote players
    for (let i = 0; i < this.enemies.length; i++) {
      const playerData = this.enemies[i];
      const name = playerData.name || `Player ${i + 1}`;
      const player = new LocalPlayer(this.game, name);

      player.look = playerData.look;
      this.game.addPlayer(player);
      this.game.model.map.addPlayerPlanetSomewhere(player);
    }

    this.navController.push(PlayPage, {game: this.game});
  }
}
