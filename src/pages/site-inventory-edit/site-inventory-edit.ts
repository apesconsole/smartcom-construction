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
  	orders: []
  }
  pendingRequest = {
    requestId: '',
    item: '',
    uom: '',
    quantity: 0,
    requestedBy: '',
    requestDate: '',
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

  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
      this.userId = this.navParams.get('userId');
    //Task Data Contains the Specific Task Inventory
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedItem = this.navParams.get('selectedItem');
	  this.canApprove = this.navParams.get('canApprove');
    this.canCreateNewOrder = this.navParams.get('canCreateNew');
    this.permission = this.navParams.get('permission');
    this.canRequest = true;
    this.loadGlobalInventoryConfig();
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
            createNewOrder = elem.createOrder;
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
        selectedItem: this.selectedItem   
    });
  }

  manageOrders(){
    this.navCtrl.push(SiteInventoryOrdersPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedItem: this.selectedItem,
        canApprove: this.canApprove,
        permission: this.permission     
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
      var newInventry = [];
      this.selectedTaskData.inventory
      	.map((elem) => {
      	  if(elem.item == this.selectedItem.item && !this.isLocked){
      	  	  elem.quantity = Number(this.selectedItem.quantity);
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
  }

  saveRequestData(){
      this.authservice.saveglobalinventoryrequest(this.globalConfigData).then(
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
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  notificationData = {
    key: '',
    subject: '',
    message: ''
  }

  saveData(){
      this.authservice.savesiteinventory(this.selectedTaskData, this.notificationData).then(
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

  approveRequestData(){
      this.authservice.approveglobalinventoryrequest(this.selectedTaskData, this.pendingRequest.requestId, this.selectedItem.item).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Request Approved',
                    buttons: ['ok']
                });
                this.selectedItem.quantity = Number(this.selectedItem.quantity) + Number(this.pendingRequest.quantity);
                this.pendingRequest.approved = true;
                dataEditAlert.present();
            } else {
                var dataEditFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Cound Not Approve',
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

  searchPendingRequests(){
    /*
      this.globalConfigData.requests
        .filter((request) =>{
          return (request.item   == this.selectedItem.item &&
                  request.siteId == this.selectedTaskData.siteId && 
                  request.taskId == this.selectedTaskData.taskId);
        })
        .map((request) => {
            if(!request.approved && !request.rejected){
                this.pendingRequest.requestId = request.requestId;
                this.pendingRequest.item = request.item;
                this.pendingRequest.uom = request.uom;
                this.pendingRequest.quantity = request.quantity;
                this.canRequest = false;
            }
            return request;
        });
      */
  }
 
  loadGlobalInventoryConfig(){
      this.authservice.getglobalinventoryconfig().then(
      data => {
          this.serverGlobalData = data;
          this.globalConfigData = this.serverGlobalData.data;
          this.globalConfigData.items
            .map((item) => {
               //This sets the canRequest flag
               this.searchPendingRequests();
               if(this.canRequest){
                  if(item.item == this.selectedItem.item){
                      this.availableGblConfig.push({
                          item: item.item,
                          currentLocation: item.currentLocation, 
                          uom: item.uom,
                          quantity:item.quantity
                      });
                  }
                }
                return item;
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
      this.globalConfigData.requests.push({
          requestId: this.getRandomInt(10000000000, 99999999999),
          siteId:this.selectedSite,
          taskId: this.selectedTask,          
          item: this.gblConfig.item,
          uom: this.gblConfig.uom,
          quantity: this.gblConfig.requestedQuantity,
          transfer: this.gblConfig.currentLocation != this.selectedSite,
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
      this.saveRequestData();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryEditPage');
  }

}
