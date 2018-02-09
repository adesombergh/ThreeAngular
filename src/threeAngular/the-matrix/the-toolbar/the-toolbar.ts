import { Component } from '@angular/core';
import { TheArchitect } from '../the-architect.service';

@Component({
  selector: 'the-toolbar',
  templateUrl: 'the-toolbar.html'
})

export class TheToolbar {
  public isActive: boolean = false;
  public tooltip: string = "";

  
  constructor(
    public TheArchitect: TheArchitect
  ) {}
  
  
  

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
    this.TheArchitect.cloneSelection();
  }

  setTooltip(tip){
    this.tooltip = tip;
    this.isActive = true;
  }

  callChangeSelectMode(){
    this.TheArchitect.changeSelectMode();
  }


}
