import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, MenuController} from 'ionic-angular';

import {AuthService} from './authservice';
import {HomePage} from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  usercreds = {
    userId: '',
    password: ''
  }

  message = '';

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public authservice: AuthService, public navParams: NavParams, private menu: MenuController) {
    this.message = this.navParams.get('message');
    if(this.message != ''){
      this.presentToast(this.message);
    }
    this.authservice.logout();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  login(user) {
    if(user.userId.trim() == ''){
      this.presentToast('User Id cannot be Blank');
      return;
    }
    else if(user.password.trim() == ''){
      this.presentToast('Password cannot be Blank');
      return;
    }
    this.authservice.authenticate(user).then(data => {
        this.navCtrl.setRoot(HomePage);
    }, error => {
       this.message = error.message;
       this.presentToast(this.message);
    });
  }

  clearMessage(ev){
    this.message = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false, 'menu');
  }
}
