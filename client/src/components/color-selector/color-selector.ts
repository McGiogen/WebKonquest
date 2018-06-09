import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PLAYER_COLORS} from "../../services/playerColors";

/**
 * Color selector
 * Accessibility reference: https://pattern-library.dequelabs.com/components/selects
 */
@Component({
  selector: 'color-selector',
  templateUrl: 'color-selector.html'
})
export class ImageSelectorComponent {

  @Input() model: string;
  @Output() modelChange = new EventEmitter<string>();
  private index: number = 0;

  constructor() {
    this.model = PLAYER_COLORS[this.index];
    this.modelChange.emit(this.model);
  }

  selectBack() {
    this.index = (this.index - 1 + PLAYER_COLORS.length) % PLAYER_COLORS.length;
    this.model = PLAYER_COLORS[this.index];
    this.modelChange.emit(this.model);
  }

  selectNext() {
    this.index = (this.index + 1) % PLAYER_COLORS.length;
    this.model = PLAYER_COLORS[this.index];
    this.modelChange.emit(this.model);
  }
}
