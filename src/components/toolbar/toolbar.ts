import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.html'
})
export class ToolbarComponent {
  @Output() addMod = new EventEmitter<boolean>();


  constructor() {
  }

  callAddMod(){
    this.addMod.emit();
  }
}
