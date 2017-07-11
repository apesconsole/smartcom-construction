import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  userData: any;
  message: string ;
  name = '';
  type = '';

  pages: Array<{type: string, title: string, component: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events) {
      
      this.userData = {};
      this.message = null;
      this.name = '';
      this.type = '';
      this.getinfo();
  }

  messageBox = {
     construction: 'Manage Sites, Analyse Construction Data remotely'
  }

  getinfo() {

      this.authservice.getinfo().then(
      data => {
          this.userData = data;
          this.name = this.userData.data.name;
          this.type = this.userData.data.type;
          this.pages = this.userData.menu;
          this.events.publish('loadmenu', this.pages);

          this.message = this.messageBox[this.type];
    	}, 
      error => {
          this.navCtrl.setRoot(LoginPage, {
              message: error.message
          }); 
      });              
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
