import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-site-inventory-add',
  templateUrl: 'site-inventory-add.html',
})
export class SiteInventoryAddPage {
 
  userId: string;
  message: string;
  selectedSite: string;
  selectedTask: string;
  selectedTaskData = {
    siteId: '',
    taskId: '',
    inventory: []
  };
  serverData: any;
  configData = {
  	configId: '',
  	items: [],
  	updateDate:'',
  	updatedBy: ''
  };
  selectedItem = {
  	item: '',
  	quantity: 0,
  	uom:''
  }
  isLocked = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
      this.userId = this.navParams.get('userId');
	    this.selectedTaskData = this.navParams.get('selectedTaskData');
	    this.selectedSite = this.selectedTaskData.siteId;
      this.selectedTask = this.selectedTaskData.taskId;
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

  selectconfig(config){
	   this.selectedItem.item = config.item;
	   this.selectedItem.uom = config.uom;
  }

  saveField(){
      if(this.isLocked){
          this.navCtrl.pop();
      }
      this.isLocked = true;
      this.selectedTaskData.inventory.push({
        "item": this.selectedItem.item,
        "quantity": this.selectedItem.quantity,
        "orders":[],
        "consumption":[],
        "uom": this.selectedItem.uom,
        "totalPrice": 0,
        "totalPayment": 0, 
        "createDate": new Date(),
        "createdBy": this.userId
      });

      this.authservice.savesiteinventory(this.selectedTaskData).then(
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
    console.log('ionViewDidLoad SiteInventoryAddPage');
  }

}
