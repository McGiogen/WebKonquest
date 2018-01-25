import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the ImageSelectorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'image-selector',
  templateUrl: 'image-selector.html'
})
export class ImageSelectorComponent {

  @Input() imgs: Array<string>;
  @Output() onSelect = new EventEmitter<number>();

  constructor() {
  }

  select(index: number): void {
    this.onSelect.emit(index);
  }
}
