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
  @Output() onSelect = new EventEmitter<number>();
  private selectionIndex: number;

  constructor() {
    this.selectionIndex = 0;
    this.onSelect.emit(this.selectionIndex);
  }

  selectBack() {
    this.selectionIndex = (this.selectionIndex - 1 + this.imgs.length) % this.imgs.length;
    this.onSelect.emit(this.selectionIndex);
  }

  selectNext() {
    this.selectionIndex = (this.selectionIndex + 1) % this.imgs.length;
    this.onSelect.emit(this.selectionIndex);
  }
}
