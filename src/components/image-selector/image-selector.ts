import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Image selector
 * Accessibility reference: https://pattern-library.dequelabs.com/components/selects
 */
@Component({
  selector: 'image-selector',
  templateUrl: 'image-selector.html'
})
export class ImageSelectorComponent {

  @Input() imgs: Array<string>;
  @Input() model: number;
  @Output() modelChange = new EventEmitter<number>();

  constructor() {
    this.model = 0;
    this.modelChange.emit(this.model);
  }

  selectBack() {
    this.model = (this.model - 1 + this.imgs.length) % this.imgs.length;
    this.modelChange.emit(this.model);
  }

  selectNext() {
    this.model = (this.model + 1) % this.imgs.length;
    this.modelChange.emit(this.model);
  }
}
