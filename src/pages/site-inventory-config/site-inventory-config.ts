import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';
import { SiteInventoryTransferPage } from '../site-inventory-transfer/site-inventory-transfer';


@IonicPage()
@Component({
  selector: 'page-site-inventory-config',
  templateUrl: 'site-inventory-config.html',
})
export class SiteInventoryConfigPage {

  userData: any;
  userId: string;
  message: string ;
  serverData: any;
  configData = {
  	configId: 'ITEM',
  	items: [],
  	updateDate:'',
  	updatedBy: ''
  };
  
  selectedItem = {
      item: '',
      quantity: 0,
      uom: '',
      currentLocation: ''
  }
  itemRequests = [];

  requestData = {
      requestId: '',
      siteId: '',
      taskId: '',
      currentLocation: '',
      item: '',
      uom:  '',
      quantity: 0,
      transfer: false,
      transferOrder: {
          transferOrderId: '',
          shippingVendor:'',
          shippingId:'',
          shippingCost: 0,
          shippingType: '',
          estimatedDeliveryDays: '',
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

  serverGlobalData: any;
  
  globalConfigData = {
      items: [],
      requests: []
  }

  permission = [];
  
  isLocked = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService, public alertCtrl: AlertController, public toastCtrl: ToastController, public events: Events) {
    	this.events.unsubscribe('refreshglobalInventoryRequest');
      this.userData = authservice.getDisplayinfo();
      this.userId = this.userData.userId;
      this.permission = this.userData.permission;
      this.loadInventoryConfig();
      this.loadGlobalInventoryConfig(); 

      this.events.subscribe('refreshGlobalInventoryRequest', (requestData) =>{
          this.globalConfigData.items = requestData._items;
          this.globalConfigData.requests = requestData._requests;
          this.loadItemRequests(requestData._request.item);
      });     
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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  loadItemRequests(_item){
    this.itemRequests = [];
    this.globalConfigData.requests
      .map((_r) => {
           if(_r.item == _item) {
              //This is for display
              this.itemRequests[this.itemRequests.length] = _r;
           }
           return _r
      });
    if(this.itemRequests.length == 0) this.presentToast('No Requests for Item: ' + _item);
  }

  loadGlobalInventoryConfig(){
      this.authservice.getglobalinventoryconfig().then(
      data => {
          this.serverGlobalData = data;
          this.globalConfigData = this.serverGlobalData.data;
      }, error => {
         this.navCtrl.setRoot(LoginPage);
         this.message = error.message;
      });
  }

  rejectRequestData(selectedRequest){
      this.authservice.rejectglobalinventoryrequests(selectedRequest, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let requestAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Request Rejected',
                    buttons: ['ok']
                });
                requestAlert.present();
            } else {
                var requestAlertFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Request Not Rejected',
                    buttons: ['ok']
                });
                requestAlertFailureAlert.present();
            }
            this.loadInventoryConfig();
            this.loadGlobalInventoryConfig(); 
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  rejectRequests(selectedRequest){
    if(!this.isLocked){
      this.isLocked = true;
      this.notificationData.key = 'task_global_inventory_request_reject_info';
      this.notificationData.subject = 'Request Reject Notification';
      this.notificationData.message = 'Request Rejected \r\n Request Rejected By:' + this.userId + '\r\n Request Id :' + selectedRequest.requestId;

      this.rejectRequestData(selectedRequest);
    }   
  }

  transferRequests(selectedRequest){
    this.navCtrl.push(SiteInventoryTransferPage, {
        userId: this.userData.userId,
        selectedRequest: selectedRequest,
        permission: this.permission     
    });
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad SiteInventoryConfigPage');
      this.menu.swipeEnable(true, 'menu');
  }
}
