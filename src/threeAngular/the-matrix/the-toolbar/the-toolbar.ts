import { Component, EventEmitter, Output } from '@angular/core';

import { TheEditorService } from '../the-editor.service';

@Component({
  selector: 'the-toolbar',
  templateUrl: 'the-toolbar.html'
})
export class TheToolbar {
  @Output() addMod = new EventEmitter();
  @Output() changeEditMode = new EventEmitter();
  @Output() deleteMod = new EventEmitter();

  nextMode = "Rotate";

  constructor( private theEditor: TheEditorService ) {
  }
  callDeleteMod(){
    console.log('Delete MOD STEP 1');
    this.deleteMod.emit();
  }
  callAddMod(){
    this.theEditor.addMod();
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
