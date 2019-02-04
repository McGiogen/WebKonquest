import {Component, OnInit} from '@angular/core';
import {Platform, AlertController} from '@ionic/angular';
import {AttackFleet} from 'webkonquest-core';
import {LocalGameHelper} from './helper/LocalGameHelper';
import {AppOptions} from '../../services/AppOptions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GameHelper } from './helper/GameHelper';
import { RemoteGameHelper } from './helper/RemoteGameHelper';
import { SetupGame } from '../setup-game/SetupGameData';
import { GameServerService } from './helper/gameserver.service';
import {ActivatedRoute, Router} from '@angular/router';
import { TempStorageService } from 'src/app/services/temp-storage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'page-play',
  templateUrl: 'play.page.html',
  styleUrls: ['play.page.scss'],
})
export class PlayPage implements OnInit {
  private alertShown: boolean;
  public helper: GameHelper;

  public view: 'change-round' | 'change-turn' | 'game';
  public attackForm: FormGroup;

  public attackFormError: boolean;
  public attackFormSubmitted: boolean;
  public attackSource: string;
  public attackTarget: string;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public platform: Platform,
    public alertCtrl: AlertController,
    public service: GameServerService,
    public tempStorage: TempStorageService,
    private location: Location,
    public appOptions: AppOptions,
  ) {
    const setupGame: SetupGame = tempStorage.setupGame;
    if (!setupGame) {
      router.navigate(['']);
    }

    if (setupGame.local) {
      this.helper = new LocalGameHelper(this, appOptions);
    } else {
      this.helper = new RemoteGameHelper(this, service, appOptions);
    }

    this.helper.startGame(setupGame);
    this.setView('change-round');
    this.alertShown = false;

    this.attackFormError = false;
    this.attackFormSubmitted = false;
  }

  ngOnInit() {
    this.attackForm = new FormGroup({
      source: new FormControl('', [Validators.maxLength(1), Validators.pattern('[a-zA-Z]'), Validators.required]),
      destination: new FormControl('', [Validators.maxLength(1), Validators.pattern('[a-zA-Z]'), Validators.required]),
      shipcount: new FormControl('', [Validators.pattern('[0-9]*'), Validators.required])
    });
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
      this.router.navigate(['/gameover'], { queryParams: { winner: this.helper.winner.name }});
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

  setView(view: 'change-round' | 'change-turn' | 'game'): void {
    this.view = view;
  }

  onBackClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.alertShown === false) {
      this.backConfirm();
    }
  }

  backConfirm(): void {
    this.alertCtrl.create({
      header: 'Confirm exit',
      message: 'Do you want to exit?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          this.alertShown = false;
        }
      }, {
        text: 'Yes',
        handler: () => {
          this.alertShown = false;
          this.location.back();
        }
      }]
    })
    .then(message => message.present())
    .then(() => (this.alertShown = true));
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
