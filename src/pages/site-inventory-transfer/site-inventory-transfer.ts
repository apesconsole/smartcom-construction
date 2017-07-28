import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';
 
 
@IonicPage()
@Component({
  selector: 'page-site-inventory-transfer',
  templateUrl: 'site-inventory-transfer.html',
})
export class SiteInventoryTransferPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryTransferPage');
  }

}
