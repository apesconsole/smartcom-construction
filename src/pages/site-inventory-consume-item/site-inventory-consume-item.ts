import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

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
  selectedTask: string;
  selectedTaskData = {
    siteId: '',
    taskId: '',
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

  notificationData = {
    key: '',
    subject: '',
    message: ''
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
      this.userId = this.navParams.get('userId');
	    this.selectedTaskData = this.navParams.get('selectedTaskData');
	    this.selectedSite = this.selectedTaskData.siteId;
      this.selectedTask = this.selectedTaskData.taskId;
      this.selectedItem = this.navParams.get('selectedItem');
      this.consumptionDetails.item = this.selectedItem.item;
      this.consumptionDetails.uom = this.selectedItem.uom;
  }

  saveRequest(){
      if(this.selectedItem.quantity < this.consumptionDetails.quantity ||
      this.consumptionDetails.quantity <= 0){
          this.consumptionDetails.quantity = 0;
          let wrongQuantityAlert = this.alertCtrl.create({
              title: 'Warning',
              subTitle: 'Invalid Quantity',
              buttons: ['change request']
          });
          wrongQuantityAlert.present();   
          return;
      } 
      this.saveData();
  }

  saveData(){
      this.authservice.consumesiteinventory(this.selectedTaskData.siteId, this.selectedTaskData.taskId, this.consumptionDetails,this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Information',
                    subTitle: this.serverData.message,
                    buttons: ['ok']
                });
                this.selectedItem = this.serverData.item;
                this.events.publish('refreshInventoryConsumption', {
                    item: this.selectedItem
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
