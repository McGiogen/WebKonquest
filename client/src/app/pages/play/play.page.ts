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
    const setupGame: SetupGame = this.tempStorage.setupGame;
    if (!setupGame) {
      this.router.navigate(['']);
    }
    this.alertShown = false;
    this.attackFormError = false;
    this.attackFormSubmitted = false;

    if (setupGame.local) {
      this.helper = new LocalGameHelper(this, this.appOptions);
    } else {
      this.helper = new RemoteGameHelper(this, this.service, this.appOptions);
    }
  }

  ngOnInit() {
    this.attackForm = new FormGroup({
      source: new FormControl('', [Validators.maxLength(1), Validators.pattern('[a-zA-Z]'), Validators.required]),
      destination: new FormControl('', [Validators.maxLength(1), Validators.pattern('[a-zA-Z]'), Validators.required]),
      shipcount: new FormControl('', [Validators.pattern('[0-9]*'), Validators.required])
    });

    this.attackForm.get('source').valueChanges.subscribe(val => {
      this.helper.setSourcePlanet(val);
    });
    this.attackForm.get('destination').valueChanges.subscribe(val => {
      this.helper.setDestinationPlanet(val);
    });
    this.attackForm.get('shipcount').valueChanges.subscribe(val => {
      this.helper.attack.ships = val;
    });

    const setupGame: SetupGame = this.tempStorage.setupGame;
    this.helper.startGame(setupGame);
    this.setView('change-round');
  }

  mapSelectedSector(sector): void {
    if (sector && sector.planet) {
      console.debug('Pianeta selezionato: ', sector.planet);
      this.helper.selectPlanet(sector.planet.name);
      this.attackForm.get('source').setValue(this.helper.attack.source ? this.helper.attack.source.name : null);
      this.attackForm.get('destination').setValue(this.helper.attack.destination ? this.helper.attack.destination.name : null);
    }
  }

  changeTurn(): void {
    if (this.view !== 'change-round') {
      this.setView('change-turn');
    }

    this.attackFormError = false;
    this.attackFormSubmitted = false;
    this.attackForm.reset();
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
