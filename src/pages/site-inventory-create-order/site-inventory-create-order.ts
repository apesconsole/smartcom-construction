import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-site-inventory-create-order',
  templateUrl: 'site-inventory-create-order.html',
})
export class SiteInventoryCreateOrderPage {
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

  orderDetails = {
  	item: '',
  	quantity: 0,
  	uom:'',
  	orderId: '',
  	vendorName: '',
  	vendorContact: '',
  	vendorAddress: '',
  	challan: '',
  	invoice: '',
	orderStatus: 'Pending',
	approved: false,
	updatedBy: '',
	updateDate: new Date,
	approvedBy: '',
	approvalDate: ''	 	
  }

  serverData: any;
  isLocked = false;
  canApprove = false;

  getRandomInt(min, max) {
  	var _min = Math.ceil(min);
  	var _max = Math.floor(max);
  	return String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
      this.userId = this.navParams.get('userId');
	  this.selectedSiteData = this.navParams.get('selectedSiteData');
	  this.selectedSite = this.selectedSiteData.siteId;
	  this.selectedItem = this.navParams.get('selectedItem');
	  this.canApprove = this.navParams.get('canApprove');

	  this.orderDetails.item = this.selectedItem.item;
	  this.orderDetails.uom = this.selectedItem.uom;
	  this.orderDetails.updatedBy = this.userId;
	  this.orderDetails.orderId = this.getRandomInt(10000000000, 99999999999);
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

  createOrder(){
      this.selectedItem.orders.push(this.orderDetails);
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
    console.log('ionViewDidLoad SiteInventoryCreateOrderPage');
  }

}
