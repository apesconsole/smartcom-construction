import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

import { SiteInventoryCreateOrderPage } from '../site-inventory-create-order/site-inventory-create-order';
import { SiteInventoryOrdersPage } from '../site-inventory-orders/site-inventory-orders';

@IonicPage()
@Component({
  selector: 'page-site-inventory-edit',
  templateUrl: 'site-inventory-edit.html',
})
export class SiteInventoryEditPage {
  userId: string;
  message: string;
  selectedSite: string;
  selectedTask: string;
  selectedTaskData = {
  	siteId: '',
    taskId: '',
  	inventory : []
  };
  selectedItem = {
  	item: '',
  	quantity: 0,
  	uom:'',
    totalPrice: 0,
    totalPayment: 0,    
  	orders: []
  }
  serverData: any;
  isLocked = false;
  canApprove = false;
  canCreateNewOrder = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
      this.userId = this.navParams.get('userId');
    //Task Data Contains the Specific Task Inventory
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedItem = this.navParams.get('selectedItem');
	  this.canApprove = this.navParams.get('canApprove');
    this.canCreateNewOrder = this.navParams.get('canCreateNew');
  }

  createOrder(){
    this.navCtrl.push(SiteInventoryCreateOrderPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedItem: this.selectedItem   
    });
  }

  manageOrders(){
    this.navCtrl.push(SiteInventoryOrdersPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedItem: this.selectedItem,
        canApprove: this.canApprove     
    });
  }

  updateField(){
      /*if(this.isLocked){
          this.navCtrl.pop();
      }
      var newInventry = [];
      this.selectedTaskData.inventory
      	.map((elem) => {
      	  if(elem.item == this.selectedItem.item && !this.isLocked){
      	      this.isLocked = true;
      	  	  elem.quantity = this.selectedItem.quantity;
      	  	  elem.approved = false;
      	  	  elem.updatedBy = this.userId,
      	  	  elem.updateDate = new Date();
      	  	  console.log('Changed -> ' + elem.item);
      	  }
      	  newInventry[newInventry.length] = elem;
		  return elem;
	  });
      this.selectedTaskData.inventory = newInventry;
      this.saveData();
      */
  }

  approveField(){
      if(this.isLocked){
          this.navCtrl.pop();
      }
      var newInventry = [];
      this.selectedTaskData.inventory
      	.map((elem) => {
      	  if(elem.item == this.selectedItem.item && !this.isLocked){
      	      this.isLocked = true;
      	  	  elem.quantity = this.selectedItem.quantity;
      	  	  elem.approved = true;
      	  	  elem.approvedBy = this.userId;
      	  	  elem.approvalDate = new Date();
      	  	  console.log('Changed -> ' + elem.item);
      	  }
      	  newInventry[newInventry.length] = elem;
		  return elem;
	  });
      this.selectedTaskData.inventory = newInventry;
      this.saveData();
  }

  saveData(){
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
    console.log('ionViewDidLoad SiteInventoryEditPage');
  }

}
