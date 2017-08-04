import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';
 
 
@IonicPage()
@Component({
  selector: 'page-site-inventory-transfer',
  templateUrl: 'site-inventory-transfer.html',
})
export class SiteInventoryTransferPage {
  userId: string;
  message: string;
  serverData: any;
  pendingRequest = {
	  requestId: '',
	  siteId: '',
	  taskId: '',
    currentLocation: '',         
	  item: '',
	  uom: '',
	  quantity: '',
	  transfer: '',
	  requestStatus: 'Open', //Open->Accepted->Transfered->Shipped->Received->Complete
	  transferOrder: {
	      transferOrderId: '',
	      shippingVendor:'',
	      shippingCost: 0,
	      shippingType: '',
	      trackingId: '',
	      currency: 'INR',
	      payment: 0
	  },
	  requestedBy: '',
	  requestDate: '',
	  rejected: false,
	  rejectedBy: '',
	  rejectionDate: '',
	  approved: false,
	  approvedBy: '',
	  approvalDate: ''
  }

  notificationData = {
    key: '',
    subject: '',
    message: ''  
  }

  shippingTypeList = [
  	{value: 'Freight', text: 'Freight'},
  	{value: 'Truck', text: 'Truck'},
  	{value: 'Van', text: 'Van'},  
  	{value: 'Person', text: 'Person'},   		
  ];

  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return 'TRNSORDID' + String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  isLocked = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
	   this.userId = this.navParams.get('userId');
	   this.pendingRequest = this.navParams.get('selectedRequest');
     if(this.pendingRequest.requestStatus == 'Allocated' && this.pendingRequest.transferOrder.transferOrderId == ''){
        this.pendingRequest.transferOrder.transferOrderId = this.getRandomInt(10000000000, 99999999999);
     }
  }

  approveRequestData(){
    this.authservice.approveglobalinventoryrequests(this.pendingRequest, this.notificationData).then(
      data => {
        this.serverData = data;
        if(this.serverData.operation) {
            let requestAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Request Approved',
                buttons: ['ok']
            });
            this.events.publish('refreshGlobalInventoryRequest', {
              _items: this.serverData._items,
            	_requests: this.serverData._requests,
            	_request: this.serverData._request
            });
            requestAlert.present();
        } else {
            var requestAlertFailureAlert = this.alertCtrl.create({
                title: 'Failure',
                subTitle: 'Request Not Approved',
                buttons: ['ok']
            });
            requestAlertFailureAlert.present();
        }
        this.navCtrl.pop();
      }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });
  }

  shipRequestData(){
    this.authservice.shipglobalinventoryrequests(this.pendingRequest, this.notificationData).then(
      data => {
        this.serverData = data;
        if(this.serverData.operation) {
            let requestAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Shipping Data Saved',
                buttons: ['ok']
            });
            console.log(this.serverData._items);
            this.events.publish('refreshGlobalInventoryRequest', {
              _items: this.serverData._items,
            	_requests: this.serverData._requests,
            	_request: this.serverData._request
            });
            requestAlert.present();
        } else {
            var requestAlertFailureAlert = this.alertCtrl.create({
                title: 'Failure',
                subTitle: 'Shipping Data Not Saved',
                buttons: ['ok']
            });
            requestAlertFailureAlert.present();
        }
        this.navCtrl.pop();
      }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });
  }

  approveRequest(){
    if(!this.isLocked){
      this.isLocked = true;
      this.approveRequestData();
    } 
  }

  shipRequest(){
    if(!this.isLocked){
      this.isLocked = true;
      this.shipRequestData();
    } 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryTransferPage');
  }

}
