import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

import { SiteInventoryCreateOrderPage } from '../site-inventory-create-order/site-inventory-create-order';
import { SiteInventoryOrdersPage } from '../site-inventory-orders/site-inventory-orders';
import { SiteInventoryRequestsPage } from '../site-inventory-requests/site-inventory-requests';

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
  globalConfigData = {
    items: [],
    requests: []
  };
  serverGlobalData: any;
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
  	orders: [],
    requests: [],
    approved: false
  }
  pendingRequest = {
    requestId: '',
    siteId: '',
    taskId: '', 
    currentLocation:'',        
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

  availableGblConfig = [];

  gblConfig = {
    currentLocation: '',
    item: '',
    uom: '',
    quantity: 0,
    requestedQuantity: 0
  }

  serverData: any;
  isLocked = false;
  canApprove = false;
  canCreateNewOrder = true;
  canRequest = true;

  permission = [];

  notificationData = {
    key: '',
    subject: '',
    message: ''
  }

  displayText = {
    siteName: '',
    taskDescription: ''
  }

  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
    this.events.unsubscribe('refreshInventoryOrder');
    this.events.unsubscribe('refreshInventoryItem');
    this.events.unsubscribe('refreshInventoryRequest');
    this.userId = this.navParams.get('userId');
    //Task Data Contains the Specific Task Inventory
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
    this.displayText = this.navParams.get('displayText');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedItem = this.navParams.get('selectedItem');
	  this.canApprove = this.navParams.get('canApprove');
    this.canCreateNewOrder = this.navParams.get('canCreateNew');
    this.permission = this.navParams.get('permission');
    this.canRequest = true;
    this.events.subscribe('refreshInventoryOrder', (_freshData) => {
        this.selectedItem.orders = _freshData;
    });
    this.events.subscribe('refreshInventoryItem', (_itemData) => {
        this.selectedItem.quantity = Number(_itemData.quantity);
        this.selectedItem.totalPrice = Number(_itemData.totalPrice); 
        this.selectedItem.totalPayment = Number(_itemData.totalPayment); 
    });
    this.events.subscribe('refreshInventoryRequest', (_requests) => {
        this.selectedItem.requests = _requests;
        this.loadPendingRequest();
    });
    console.log(this.selectedItem)
    this.loadPendingRequest();
  }

  viewFinance(){
    let viewFinance = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedSite){
            viewFinance =  elem.viewFinance;
            return;
        }
        return elem;
    });
    return viewFinance;
  }

  canCreateOrder(){
    let createNewOrder = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedSite){
            createNewOrder = elem.createOrder && this.selectedItem.approved;
            return;
        }
        return elem;
    });
    return createNewOrder;
  }

  selectGlobalItem(item){
      this.gblConfig = {
        currentLocation: item.currentLocation,
        item: item.item,
        uom: item.uom,
        quantity: item.quantity,
        requestedQuantity: 0
      }
  }

  createOrder(){
    this.navCtrl.push(SiteInventoryCreateOrderPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedItem: this.selectedItem,
        displayText: this.displayText
    });
  }

  manageOrders(){
    this.navCtrl.push(SiteInventoryOrdersPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedItem: this.selectedItem,
        canApprove: this.canApprove,
        permission: this.permission,
        displayText: this.displayText     
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
    if(!this.isLocked){
      this.isLocked = true;
      this.notificationData.key = 'task_inventory_approval_info';
      this.notificationData.subject = 'Item Approved Notification';
      this.notificationData.message = 'Item Approved \r\n Item Approved By:' + this.userId + '\r\n Site :' + this.displayText.siteName + '\r\n Task:' + this.displayText.taskDescription;
      this.approveInventoryData();
    }
  }

  saveRequestData(requestData){
      this.authservice.saveglobalinventoryrequest(requestData, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let requestAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Request Saved',
                    buttons: ['ok']
                });
                requestAlert.present();
            } else {
                var requestAlertFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Request Not Saved',
                    buttons: ['ok']
                });
                requestAlertFailureAlert.present();
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

  approveInventoryData(){
      let _itemName = this.selectedItem.item;
      this.authservice.approveinventory(_itemName, this.selectedSite, this.selectedTask, this.notificationData).then(
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

  releaseInventoryData(){
      let _itemName = this.selectedItem.item;
      this.authservice.releaseinventory(_itemName, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataReleaseAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Item Quantity Released. The Item will be available in Global Inventory.',
                    buttons: ['ok']
                });
                dataReleaseAlert.present();
            } else {
                var dataReleaseFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Data Not Saved',
                    buttons: ['ok']
                });
                dataReleaseFailureAlert.present();
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

  loadRequestData(){
    this.navCtrl.push(SiteInventoryRequestsPage, {
        userId: this.userId,
        displayText: this.displayText,
        pendingRequest: this.pendingRequest,
        permission: this.permission        
    });
  }

  loadPendingRequest(){
      this.canRequest = true;
      this.selectedItem.requests
        .map((request) => {
            if(request.requestStatus != 'Complete' && request.requestStatus != 'Cancelled'){
                this.pendingRequest = request;
                this.canRequest = false;
            }
            return request;
        });
        console.log(this.pendingRequest);
        if(this.canRequest) this.loadGlobalInventoryConfig();
  }
 
  loadGlobalInventoryConfig(){
      this.authservice.getglobalinventoryconfig().then(
      data => {
          this.serverGlobalData = data;
          this.globalConfigData = this.serverGlobalData.data;
          this.globalConfigData.items
            .map((_i) => {
                if(_i.item == this.selectedItem.item && Number(_i.quantity) > 0)
                  this.availableGblConfig.push(_i);
                return _i;
            });
      }, error => {
         this.navCtrl.setRoot(LoginPage);
         this.message = error.message;
      });
  }

  requestGlobalItem(){   
    if(Number(this.gblConfig.requestedQuantity) <= 0 || 
      Number(this.gblConfig.requestedQuantity) > Number(this.gblConfig.quantity)
    ) {
      let invalidQtyAlert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'Invalid Quantity',
          buttons: ['ok']
      });
      invalidQtyAlert.present();
      return;        
    }  
    if(!this.isLocked){

      this.notificationData.key = 'task_global_inventory_request';
      this.notificationData.subject = 'Global Inventory Request Notification';
      this.notificationData.message = 'Global Inventory Request \r\n Requested By:' + this.userId + '\r\n Site :' + this.displayText.siteName + '\r\n Task:' + this.displayText.taskDescription + '\r\n Requested Item:' + this.gblConfig.item + '\r\n Requested Quantity:' + this.gblConfig.quantity + ' ' + this.gblConfig.uom;

      this.saveRequestData({
          requestId: this.getRandomInt(10000000000, 99999999999),
          siteId:this.selectedSite,
          taskId: this.selectedTask,          
          item: this.gblConfig.item,
          currentLocation: this.gblConfig.currentLocation,
          uom: this.gblConfig.uom,
          quantity: this.gblConfig.requestedQuantity,
          transfer: this.gblConfig.currentLocation != this.selectedSite,
          requestStatus: 'Open', //Open->Accepted->Transfered->Shipped->Received->Complete
          transferOrder: {
              transferOrderId: '',
              shippingVendor:'',
              shippingId:'',
              shippingCost: 0,
              shippingType: '',
              trackingId: '',
              currency: 'INR',
              payment: 0
          },
          requestedBy: this.userId,
          requestDate: new Date(),
          rejected: false,
          rejectedBy: '',
          rejectionDate: '',
          approved: false,
          approvedBy: '',
          approvalDate: ''
      });
    }
  }

  releaseItem(){
    if(!this.isLocked){
      this.isLocked = true;
      this.releaseInventoryData();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryEditPage');
  }

}
