import { Component } from '@angular/core';

@Component({
  selector: 'right-menu',
  templateUrl: 'right-menu.html'
})
export class RightMenuComponent {

  isActive = true;

  constructor() {}

  activeButton() {
    this.isActive = !this.isActive;
  }
}
