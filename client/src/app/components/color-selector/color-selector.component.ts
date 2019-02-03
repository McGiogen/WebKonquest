import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PLAYER_COLORS} from '../../services/playerColors';

/**
 * Color selector
 * Accessibility reference: https://pattern-library.dequelabs.com/components/selects
 */
@Component({
  selector: 'app-color-selector',
  templateUrl: 'color-selector.component.html',
  styleUrls: ['color-selector.component.scss'],
})
export class ColorSelectorComponent {

  @Input()
  set model(model: string) {
    this.index = PLAYER_COLORS.findIndex((color) => {
      return color === model;
    })
  }

  get model(): string {
    return PLAYER_COLORS[this.index];
  }

  @Output() modelChange = new EventEmitter<string>();

  private index: number = 0;

  constructor() {
    this.modelChange.emit(PLAYER_COLORS[this.index]);
  }

  selectBack() {
    this.index = (this.index - 1 + PLAYER_COLORS.length) % PLAYER_COLORS.length;
    this.modelChange.emit(PLAYER_COLORS[this.index]);
  }

  selectNext() {
    this.index = (this.index + 1) % PLAYER_COLORS.length;
    this.modelChange.emit(PLAYER_COLORS[this.index]);
  }
}
