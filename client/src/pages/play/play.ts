import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Platform, AlertController, Navbar} from 'ionic-angular';
import {AttackFleet} from 'webkonquest-core';
import {LocalGameHelper} from './helper/LocalGameHelper';
import {AppOptions} from '../../services/AppOptions';
import {GameoverPage} from '../gameover/gameover';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GameHelper } from './helper/GameHelper';
import { RemoteGameHelper } from './helper/RemoteGameHelper';
import { SetupGame } from '../setup-game/SetupGameData';
import { GameServerService } from './helper/gameserver.service';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {
  @ViewChild(Navbar) navBar: Navbar;
  private goBack: (ev: UIEvent) => void;

  private helper: GameHelper;
  private alertShown: boolean;
  public appOptions: AppOptions;

  public view: string; // 'change-round', 'change-turn', 'game'
  public attackForm: FormGroup;

  public attackFormError: boolean;
  public attackFormSubmitted: boolean;
  public attackSource: string;
  public attackTarget: string;

  constructor(public navController: NavController, navParams: NavParams, public platform: Platform, public alertCtrl: AlertController, service: GameServerService) {
    this.appOptions = AppOptions.instance;
    const setupGame: SetupGame = navParams.get('setupGame');
    if (setupGame.local) {
      this.helper = new LocalGameHelper(this);
    } else {
      this.helper = new RemoteGameHelper(this, service);
    }

    this.helper.startGame(setupGame);
    this.setView('change-round');
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

  mapSelectedSector(sector): void {
    if (sector && sector.planet) {
      console.debug('Pianeta selezionato: ', sector.planet);
      this.helper.selectPlanet(sector.planet.name);
      this.attackSource = this.helper.attack.source ? this.helper.attack.source.name : null;
      this.attackTarget = this.helper.attack.destination ? this.helper.attack.destination.name : null;
    }
  }

  changeTurn(): void {
    if (this.view !== 'change-round') {
      this.setView('change-turn');
    }

    this.attackFormError = false;
    this.attackFormSubmitted = false;
    this.attackSource = null;
    this.attackTarget = null;
  }

  changeRound(): void {
    this.setView('change-round');
  }

  onStartTurn(): void {
    if (this.helper.winner) {
      this.navController.push(GameoverPage, { winner: this.helper.winner });
    } else {
      this.setView('change-turn');
    }
  }

  attack(): void {
    this.attackFormSubmitted = true;
    let success = false;
    if (this.attackForm.valid) {
      success = this.helper.doAttack();
    }
    this.attackFormError = !success;
  }

  attackCompleted(success: boolean): void {
    if (success) {
      this.attackForm.reset();
      this.attackFormError = false;
      this.attackFormSubmitted = false;
    } else {
      this.attackFormError = true;
    }
  }

  cancelAttack(attack: AttackFleet): void {
    this.helper.cancelAttack(attack);
  }

  endTurn(): void {
    this.helper.endTurn();
  }

  setView(view: string): void {
    this.view = view;
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

  fightToString(fight) {
    if (fight.attacker.name === fight.defender.name) {
      return `Reinforcements (${fight.attackerShips} ships) have arrived for planet ${fight.defenderPlanet.name}. ${fight.winnerShips} ships ready to fight.`;
    }
    if (fight.winner.name === fight.defender.name) {
      return `Planet ${fight.defenderPlanet.name} has held against an attack from ${fight.attacker.name}. ${fight.winnerShips} survivors.`;
    }
    return `Planet ${fight.defenderPlanet.name} has fallen to ${fight.attacker.name}. ${fight.winnerShips} survivors.`;
  }
}
