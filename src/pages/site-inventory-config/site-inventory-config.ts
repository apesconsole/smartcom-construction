import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-site-inventory-config',
  templateUrl: 'site-inventory-config.html',
})
export class SiteInventoryConfigPage {

  userData: any;
  message: string ;
  serverData: any;
  configData = {
  	configId: 'ITEM',
  	items: [],
  	updateDate:'',
  	updatedBy: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService, public alertCtrl: AlertController) {
    	this.userData = authservice.getDisplayinfo();
  }

  ionViewDidLoad() {
    	console.log('ionViewDidLoad SiteInventoryConfigPage');
    	this.menu.swipeEnable(true, 'menu');
    	this.loadInventoryConfig();
  }

  loadInventoryConfig(){
    this.authservice.getinventoryconfig().then(
    data => {
    	this.serverData = data;
        this.configData = this.serverData.data;
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });
  }

  saveconfig(){
    this.authservice.saveinventoryconfig(this.configData).then(
    data => {
    	this.serverData = data;
        if(this.serverData.operation) {
            let dataEditAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Data Saved',
                buttons: ['ok']
            });
            dataEditAlert.present();
        } else {
            var dataEditFailureAlert = this.alertCtrl.create({
                title: 'Failure',
                subTitle: 'Data Not Saved',
                buttons: ['ok']
            });
            dataEditFailureAlert.present();
        }
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });
  }

  removeconfig(item){
    let index = this.configData.items.indexOf(item);
    if(index > -1){
        this.configData.items.splice(index, 1);
    }
  }
  
  removeError(){
    let deleteErrorAlert = this.alertCtrl.create({
        title: 'Delete Not Allowed',
        subTitle: 'The Item has Inventry associated',
        buttons: ['ok']
    });
    deleteErrorAlert.present();
  }

  addinventory(){
      this.configData.items.push({
        "item": "New Item",
        "dimension": "0",
        "uom": "Unit",
        "canDelete": true
      });
  }

}
