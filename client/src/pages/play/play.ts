import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Platform, AlertController, Navbar} from 'ionic-angular';
import {LocalGame, GameEvent, AttackFleet} from 'webkonquest-core';
import {LocalGameHelper} from './LocalGameHelper';
import {AppOptions} from '../../services/AppOptions';
import {GameoverPage} from '../gameover/gameover';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {
  @ViewChild(Navbar) navBar: Navbar;
  private goBack: (ev: UIEvent) => void;

  private game: LocalGame;
  private helper: LocalGameHelper;
  private appOptions: AppOptions;
  private alertShown: boolean;

  view: string; // 'change-round', 'change-turn', 'game'
  attackForm: FormGroup;

  attackFormError: boolean;
  attackFormSubmitted: boolean;
  attackSource: string;
  attackTarget: string;

  constructor(public navController: NavController, navParams: NavParams, public platform: Platform, public alertCtrl: AlertController) {
    this.appOptions = AppOptions.instance;
    this.game = navParams.get('game');
    this.helper = new LocalGameHelper(this.game);

    this.game.eventEmitter.on(GameEvent.PlayerTurnStart, this.changeTurn.bind(this));
    this.game.eventEmitter.on(GameEvent.RoundStart, this.changeRound.bind(this));
    this.game.eventEmitter.on(GameEvent.GameOver, this.endGame.bind(this));

    this.helper.startGame();
    this.view = 'change-round';
    this.alertShown = false;

    this.attackFormError = false;
    this.attackFormSubmitted = false;

    // Customizing back button to ask for a Confirm
    platform.ready().then(() => {
      platform.registerBackButtonAction((ev) => {
        if (this.alertShown === false) {
          this.backConfirm(ev);
        }
      }, 0)
    });
  }

  ngOnInit() {
    this.attackForm = new FormGroup({
      source: new FormControl('', [Validators.maxLength(1), Validators.pattern('[a-zA-Z]'), Validators.required]),
      destination: new FormControl('', [Validators.maxLength(1), Validators.pattern('[a-zA-Z]'), Validators.required]),
      shipcount: new FormControl('', [Validators.pattern('[0-9]*'), Validators.required])
    });
  }

  // Customizing back button to ask for a Confirm
  ionViewDidLoad(): void {
    this.goBack = this.navBar.backButtonClick.bind(this.navBar);
    this.navBar.backButtonClick = this.backConfirm.bind(this);
  }

  mapSelectedSector(sector) {
    if (sector && sector.planet) {
      console.debug('Pianeta selezionato: ', sector.planet);
      this.helper.selectPlanet(sector.planet.name);
      this.attackSource = this.helper.attackSource ? this.helper.attackSource.name : null;
      this.attackTarget = this.helper.attackDestination ? this.helper.attackDestination.name : null;
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
    this.attackFormSubmitted = true;
    if (this.attackForm.valid) {
      const result = this.helper.doAttack();
      if (result) {
        this.attackForm.reset();
        this.attackFormError = false;
        this.attackFormSubmitted = false;
      } else {
        this.attackFormError = true;
      }
    }
  }

  cancelAttack(attack: AttackFleet): void {
    this.helper.cancelAttack(attack);
  }

  endTurn(): void {
    this.helper.endTurn();
  }

  endGame(): void {
    this.navController.push(GameoverPage, { game: this.game });
  }

  backConfirm(ev: UIEvent): void {
    const alert = this.alertCtrl.create({
      title: 'Confirm exit',
      message: 'Do you want to exit?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {}
      }, {
        text: 'Yes',
        handler: () => {
          this.alertShown = false;
          this.goBack(ev);
        }
      }]
    });
    alert.present().then(()=>{
      this.alertShown = true;
    });
  }
}
