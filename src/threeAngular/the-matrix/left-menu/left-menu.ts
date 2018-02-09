import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
// import { LoginPage } from '../../../pages/login/login'; 


@Component({
  selector: 'left-menu',
  templateUrl: 'left-menu.html'
})
export class LeftMenuComponent {

  isActive = true;

  constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController,
    public navParams: NavParams
  ){}

  activeButton() {
    this.isActive = !this.isActive;
  }

  // logInOrSignIn() {
  //   if (this.isLoggedIn()) {
  //     this.navCtrl.parent.select(2);
  //   }
  //   else {
  //     this.navCtrl.push(LoginPage);
  //   }

  // }

  isLoggedIn() {
    return localStorage.getItem('isLoggedIn') ? true : false;
  }
}
