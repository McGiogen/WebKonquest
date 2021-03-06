import {Component} from '@angular/core';
import {AppOptions, InteractMode, Graphics} from '../../services/AppOptions';

@Component({
  selector: 'page-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage {
  InteractMode = InteractMode;
  Graphics = Graphics;

  constructor(public appOptions: AppOptions) { }

}
