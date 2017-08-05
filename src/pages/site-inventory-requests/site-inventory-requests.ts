import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-site-inventory-requests',
  templateUrl: 'site-inventory-requests.html',
})
export class SiteInventoryRequestsPage {
  userId: string;
  message: string;

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
	      estimatedDeliveryDays: '',
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

  serverData: any;
  permission = [];  
  isLocked = false;

  displayText = {
    siteName: '',
    taskDescription: ''
  }

  notificationData = {
    key: '',
    subject: '',
    message: ''  
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
	this.userId = this.navParams.get('userId');
	this.displayText = this.navParams.get('displayText');
	this.pendingRequest = this.navParams.get('pendingRequest');
	this.permission = this.navParams.get('permission');
  }

  canApprove(){
    let approve = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.pendingRequest.siteId){
            approve =  elem.approve;
            return;
        }
        return elem;
    });
    return approve;
  }

  canReceive(){
    let receive = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.pendingRequest.siteId){
            receive =  elem.receive;
            return;
        }
        return elem;
    });
    return receive;
  }

  canPay(){
    let pay = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.pendingRequest.siteId){
            pay =  elem.pay;
            return;
        }
        return elem;
    });
    return pay;
  }

  cancelRequestData(){
    this.authservice.cancelinventoryrequest(this.pendingRequest, this.notificationData).then(
      data => {
        this.serverData = data;
        if(this.serverData.operation) {
            let requestAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Request Cancelled',
                buttons: ['ok']
            });
            this.events.publish('refreshSiteData', this.pendingRequest.siteId);
            this.events.publish('refreshInventoryData', {
                siteId: this.pendingRequest.siteId, 
                taskId: this.pendingRequest.taskId
            });  
            this.events.publish('refreshInventoryItem', {
                quantity: this.serverData.item.quantity,
                totalPrice: this.serverData.item.totalPrice,
                totalPayment: this.serverData.item.totalPayment
            });           
            this.events.publish('refreshInventoryRequest', this.serverData.item.requests);
            requestAlert.present();
        } else {
            var requestAlertFailureAlert = this.alertCtrl.create({
                title: 'Failure',
                subTitle: 'Request Not Cancelled',
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

  receiveRequestData(){
    this.authservice.receiveinventoryrequest(this.pendingRequest, this.notificationData).then(
      data => {
        this.serverData = data;
        if(this.serverData.operation) {
            let requestAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Items Received',
                buttons: ['ok']
            });
            this.events.publish('refreshSiteData', this.pendingRequest.siteId);
            this.events.publish('refreshInventoryData', {
                siteId: this.pendingRequest.siteId, 
                taskId: this.pendingRequest.taskId
            }); 
            this.events.publish('refreshInventoryItem', {
                quantity: this.serverData.item.quantity,
                totalPrice: this.serverData.item.totalPrice,
                totalPayment: this.serverData.item.totalPayment
            });            
            this.events.publish('refreshInventoryRequest', this.serverData.item.requests);
            requestAlert.present();
        } else {
            var requestAlertFailureAlert = this.alertCtrl.create({
                title: 'Failure',
                subTitle: 'Data Not Saved',
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

  approveRequestData(m){
    this.authservice.approveinventoryrequest(this.pendingRequest, this.notificationData).then(
      data => {
        this.serverData = data;
        if(this.serverData.operation) {
            let requestAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Items ' + m,
                buttons: ['ok']
            });
            this.events.publish('refreshSiteData', this.pendingRequest.siteId);
            this.events.publish('refreshInventoryData', {
                siteId: this.pendingRequest.siteId,   
                taskId: this.pendingRequest.taskId
            });            
            this.events.publish('refreshInventoryItem', {
                quantity: this.serverData.item.quantity,
                totalPrice: this.serverData.item.totalPrice,
                totalPayment: this.serverData.item.totalPayment
            });
            this.events.publish('refreshInventoryRequest', this.serverData.item.requests);
            requestAlert.present();
        } else {
            var requestAlertFailureAlert = this.alertCtrl.create({
                title: 'Failure',
                subTitle: 'Data Not Saved',
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

  payRequestData(){
    this.authservice.payinventoryrequest(this.pendingRequest, this.notificationData).then(
      data => {
        this.serverData = data;
        if(this.serverData.operation) {
            let requestAlert = this.alertCtrl.create({
                title: 'Success',
                subTitle: 'Payment Saved',
                buttons: ['ok']
            });
            this.events.publish('refreshSiteData', this.pendingRequest.siteId);
            this.events.publish('refreshInventoryData', {
                siteId: this.pendingRequest.siteId, 
                taskId: this.pendingRequest.taskId
            });          
            this.events.publish('refreshInventoryItem', {
                quantity: this.serverData.item.quantity,
                totalPrice: this.serverData.item.totalPrice,
                totalPayment: this.serverData.item.totalPayment
            });   
            this.events.publish('refreshInventoryRequest', this.serverData.item.requests);
            requestAlert.present();
        } else {
            var requestAlertFailureAlert = this.alertCtrl.create({
                title: 'Failure',
                subTitle: 'Data Not Saved',
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

  cancelRequest(){
    if(!this.isLocked){
      this.isLocked = true;
      this.cancelRequestData();
    }   
  }

  receiveRequest(){
    if(!this.isLocked){
      this.isLocked = true;
      this.receiveRequestData();
    }   
  }

  approveRequest(m){
    if(!this.isLocked){
      this.isLocked = true;
      this.approveRequestData(m);
    }   
  }  

  payRequest(){
    if(!this.isLocked){
      this.isLocked = true;
      this.payRequestData();
    }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryRequestsPage');
  }

}
