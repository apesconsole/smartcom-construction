import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-site-inventory-orders',
  templateUrl: 'site-inventory-orders.html',
})
export class SiteInventoryOrdersPage {
  userId: string;
  message: string;
  selectedSite: string;
  selectedSiteData = {
  	siteId: '',
  	inventory : []
  };
  selectedItem = {
  	item: '',
  	quantity: 0,
  	uom:'',
  	orders:[]
  }
  serverData: any;
  isLocked = false;
  canApprove = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
      this.userId = this.navParams.get('userId');
	  this.selectedSiteData = this.navParams.get('selectedSiteData');
	  this.selectedSite = this.selectedSiteData.siteId;
	  this.selectedItem = this.navParams.get('selectedItem');
	  this.canApprove = this.navParams.get('canApprove');
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

  approveOrder(order){
  	  var newOrders = [];
	  this.selectedItem.orders
	  	.map((o) => {
	  		if(o.orderId == order.orderId){
	  			o.approved = true;
	  			o.updatedBy = this.userId
	  			o.updateDate = new Date();

	  			this.selectedItem.quantity = Number(this.selectedItem.quantity) + Number(o.quantity);
	  		}
	  		newOrders[newOrders.length] = o;
	  		return o;
	  	});
	  this.selectedItem.orders = newOrders;

      var newInventry = [];
      this.selectedSiteData.inventory
      	.map((elem) => {
      	  if(elem.item == this.selectedItem.item){
      	  		elem.orders = this.selectedItem.orders;
      	  		elem.quantity = this.selectedItem.quantity;
      	  }
      	  newInventry[newInventry.length] = elem;
		  return elem;
	  });
      this.selectedSiteData.inventory = newInventry;

	  this.saveData();	

  }

  completeOrder(order){
  	  var newOrders = [];
	  this.selectedItem.orders
	  	.map((o) => {
	  		if(o.orderId == order.orderId){
	  			o.orderStatus = 'Complete';
	  			o.updatedBy = this.userId;
	  			o.updateDate = new Date();
	  		}
	  		newOrders[newOrders.length] = o;
	  		return o;
	  	});
	  this.selectedItem.orders = newOrders;

      var newInventry = [];
      this.selectedSiteData.inventory
      	.map((elem) => {
      	  if(elem.item == this.selectedItem.item){
      	  		elem.orders = this.selectedItem.orders;
      	  }
      	  newInventry[newInventry.length] = elem;
		  return elem;
	  });
      this.selectedSiteData.inventory = newInventry;

	  this.saveData();	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryOrdersPage');
  }

}
