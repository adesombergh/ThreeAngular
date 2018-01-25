import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.html'
})
export class ToolbarComponent {
  @Output() addMod = new EventEmitter();
  @Output() changeEditMode = new EventEmitter();

  nextMode = "Rotate";

  constructor() {
  }

  callAddMod(){
    this.addMod.emit();
  }
  callChangeEditMode(){
    this.changeEditMode.emit(this.nextMode);

    if (this.nextMode==="Rotate") {
      this.nextMode="Move";
    } else {
      this.nextMode="Rotate";
    }
  }
}
