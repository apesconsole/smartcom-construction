import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, AlertController, Events } from 'ionic-angular';
import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  userData: any;
  siteData: any;
  sites = [];
  message: string ;
  name = '';
  type = '';

  pages: Array<{type: string, title: string, component: string}>;

  constructor(public navCtrl: NavController, private menu: MenuController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events) {
      this.userData = {};
      this.name = '';
      this.type = '';
      this.getinfo(null);
  }

  doRefresh(refresher) {
    this.getinfo(function(){
      refresher.complete();
    });
  }

  loadSiteMatrix(callBack){
      this.authservice.constructionsitematrix().then(
        data => {
            this.siteData = data;
            this.sites = this.siteData.data; 
            if(null != callBack) callBack();       
        }, error => {
            this.navCtrl.setRoot(LoginPage);
            this.message = error.message;
      });
  }

  getinfo(callBack) {
      this.authservice.getinfo().then(
      data => {
          this.userData = data;
          this.name = this.userData.data.name;
          this.type = this.userData.data.type;
          this.pages = this.userData.menu;
          this.events.publish('loadmenu', this.pages);
          this.loadSiteMatrix(callBack);
    	}, 
      error => {
          this.navCtrl.setRoot(LoginPage, {
              message: error.message
          }); 
      });              
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.menu.swipeEnable(true, 'menu'); 
  }

}
