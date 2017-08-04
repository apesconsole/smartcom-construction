import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

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
    release: false,
  	orders:[],
    consumption: []
  }

  orderDetails = {
    uom: '',
  	quantity: 0,
  	orderId: '',
  	vendorName: '',
  	vendorContact: '',
  	vendorAddress: '',
    currency: 'INR',
    unitPrice: 0,
    tax:0,
    totalPrice: 0,
    payments: [],
    totalPayment: 0,
  	challan: '',
  	invoice: '',
	  orderStatus: 'Pending',
	  approved: false,
    createDate: new Date(),
    createdBy: '',
	   updatedBy: '',
	   updateDate: '',
	   approvedBy: '',
	   approvalDate: '',
     estimatedDeliveryDays: 0	 	
  }

  notificationData = {
    key: '',
    subject: '',
    message: ''
  }

  displayText = {
    siteName: '',
    taskDescription: ''
  }

  serverData: any;
  isLocked = false;
  canApprove = false;

  getRandomInt(min, max) {
  	var _min = Math.ceil(min);
  	var _max = Math.floor(max);
  	return 'ITMORDID' + String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  setTotalPrice(){
      this.orderDetails.totalPrice = Number(this.orderDetails.quantity * this.orderDetails.unitPrice) + Number(this.orderDetails.tax);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
    this.userId = this.navParams.get('userId');
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
    this.isLocked = false;
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedItem = this.navParams.get('selectedItem');
	  this.canApprove = this.navParams.get('canApprove');
    this.displayText = this.navParams.get('displayText');
	  this.orderDetails.uom = this.selectedItem.uom;
	  this.orderDetails.createdBy = this.userId;
	  this.orderDetails.orderId = this.getRandomInt(10000000000, 99999999999);
  }

  saveData(){
      this.authservice.addinventoryorder(this.selectedItem.item, this.orderDetails, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshInventoryOrder', this.serverData.orders); 
                dataEditAlert.present();
            } else {
                var dataEditFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Data Not Saved',
                    buttons: ['ok']
                });
                dataEditFailureAlert.present();
                this.isLocked = false;
            }
            this.events.publish('refreshSiteData', this.selectedSite);
            this.events.publish('refreshInventoryData', {
                siteId: this.selectedSite, 
                taskId: this.selectedTask
            });           
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  createOrder(){
    if(!this.isLocked){
        this.isLocked = true;
  	    this.saveData();	
    }      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryCreateOrderPage');
  }

}
