import { Component } from '@angular/core';
import { TheArchitect } from '../the-architect.service';

@Component({
  selector: 'the-toolbar',
  templateUrl: 'the-toolbar.html'
})

export class TheToolbar {
  constructor( private TheArchitect: TheArchitect ) {}
  
  callDeleteMod(){
    this.TheArchitect.removeSelected();
  }
  callAddMod(){
    this.TheArchitect.addMod();
  }
  callChangeEditMode(){
    this.TheArchitect.changeEditMode();
  }
  callCloneObject(){
    this.TheArchitect.cloneObject();
  }
}
