import { Component, EventEmitter, Output } from '@angular/core';
import { TheEditorService } from '../the-editor.service';

@Component({
  selector: 'the-toolbar',
  templateUrl: 'the-toolbar.html'
})

export class TheToolbar {
  constructor( private theEditor: TheEditorService ) {}
  
  callDeleteMod(){
    this.theEditor.removeSelected();
  }
  callAddMod(){
    this.theEditor.addMod();
  }
  callChangeEditMode(){
    this.theEditor.changeEditMode();
  }
  callCloneObject(){
    this.theEditor.cloneObject();
  }
}
