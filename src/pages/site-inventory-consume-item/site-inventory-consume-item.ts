import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-site-inventory-consume-item',
  templateUrl: 'site-inventory-consume-item.html',
})
export class SiteInventoryConsumeItemPage {
  userId: string;
  message: string;
  selectedSite: string;
  selectedSiteData = {
    siteId: '',
    inventory : []
  };
  serverData: any;
  selectedItem = {
    item: '',
    quantity: 0,
    uom:'',
    inventory:[]
  }

  consumptionDetails = {
    item: '',
    quantity: 0,
    uom:'',
    consumedBy: this.userId,
    consumedDate: new Date()
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
      this.userId = this.navParams.get('userId');
	    this.selectedSiteData = this.navParams.get('selectedSiteData');
	    this.selectedSite = this.selectedSiteData.siteId;
      this.selectedItem = this.navParams.get('selectedItem');
      this.consumptionDetails.item = this.selectedItem.item;
      this.consumptionDetails.uom = this.selectedItem.uom;
  }

  saveRequest(){
      if(this.selectedItem.quantity < this.consumptionDetails.quantity){
          this.consumptionDetails.quantity = 0;
          let wrongQuantityAlert = this.alertCtrl.create({
              title: 'Warning',
              subTitle: 'Requested Qauntity Exceeded Inventory',
              buttons: ['change request']
          });
          wrongQuantityAlert.present();  
          this.navCtrl.pop();    
          return;
      }
      var newInventry = [];
      this.selectedSiteData.inventory
        .map((elem) => {
          if(elem.item == this.selectedItem.item){
              elem.quantity = this.selectedItem.quantity - this.consumptionDetails.quantity;
              elem.consumption.push(this.consumptionDetails);
          }
          newInventry[newInventry.length] = elem;
          return elem;
      });
      this.selectedSiteData.inventory = newInventry;
      this.saveData();
  }

  saveData(){
      this.authservice.savesiteinventory(this.selectedSiteData).then(
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
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryConsumeItemPage');
  }

}