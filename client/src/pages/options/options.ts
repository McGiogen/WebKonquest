import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AppOptions, InteractMode} from "../../services/AppOptions";

@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {
  InteractMode = InteractMode;
  private appOptions: AppOptions;

  constructor(public navCtrl: NavController) {
    this.appOptions = AppOptions.instance;
  }

}