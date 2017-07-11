import { Component } from '@angular/core';
import { NavController , NavParams, MenuController} from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public authservice: AuthService, public navParams: NavParams, private menu: MenuController) {
    this.message = this.navParams.get('message');
    this.authservice.logout();
  }

  login(user) {
    if(user.userId.trim() == ''){
      this.message = 'User Id cannot be Blank';
      return;
    }
    else if(user.password.trim() == ''){
      this.message = 'Password cannot be Blank';
      return;
    }
    this.authservice.authenticate(user).then(data => {
        this.navCtrl.setRoot(HomePage);
    }, error => {
       this.message = error.message;
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
