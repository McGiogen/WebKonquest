import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LocalGame} from "../../game/localgame";
import {LocalPlayer} from "../../game/localplayer";
import {LocalGameHelper} from "./LocalGameHelper";
import {AppOptions, InteractMode} from "../../services/AppOptions";
import {GameConfig} from "../../game/config";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {

  private game: LocalGame;
  private appOptions: AppOptions;
  private helper: LocalGameHelper;

  constructor(public navCtrl: NavController) {
    const gameConfig = new GameConfig();
    this.game = new LocalGame(gameConfig);
    this.appOptions = new AppOptions();
    this.appOptions.interactMode = InteractMode.DoubleTap;
    this.helper = new LocalGameHelper(this.game, this.appOptions);

    // Adding some data to the game
    let player1 = new LocalPlayer(this.game, 'Gioele', 'green');
    this.game.addPlayer(player1);
    let player2 = new LocalPlayer(this.game, 'Linus Torvalds', 'black');
    this.game.addPlayer(player2);
    this.game.model.map.addNeutralPlanetSomewhere(this.game.model.neutral);
    this.game.model.map.addPlayerPlanetSomewhere(player1);
    this.game.model.map.addPlayerPlanetSomewhere(player2);

    this.game.start();
  }

  mapSelectedSector(sector) {
    console.log('Settore selezionato: ', sector);
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
}
