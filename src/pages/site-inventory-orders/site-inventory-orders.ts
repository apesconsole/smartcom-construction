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
  	orders:[],
    totalPrice: 0,
    totalPayment: 0
  }

  order = {
    item: '',
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
    totalPayment: 0,
    payments: [],
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
     paidAmount: 0,
     ballance: 0 
  }

  serverData: any;
  isLocked = false;
  canApprove = false;

  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  setTotalPrice(orderDetails){
      orderDetails.totalPrice = Number(orderDetails.quantity * orderDetails.unitPrice) + Number(orderDetails.tax);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
    this.userId = this.navParams.get('userId');
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedItem = this.navParams.get('selectedItem');
	  this.canApprove = this.navParams.get('canApprove');
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

  approveOrder(order){
  	  var newOrders = [];
	  this.selectedItem.orders
	  	.map((o) => {
	  		if(o.orderId == order.orderId){
	  			o.approved = true;
	  			o.approvedBy = this.userId;
	  			o.approvalDate = new Date();
          o.totalPayment = 0;
          this.selectedItem.totalPrice = Number(this.selectedItem.totalPrice) + Number(o.totalPrice);
	  			this.selectedItem.quantity = Number(this.selectedItem.quantity) + Number(o.quantity);
	  		}
	  		newOrders[newOrders.length] = o;
	  		return o;
	  	});
	    this.selectedItem.orders = newOrders;
      var newInventry = [];
      this.selectedTaskData.inventory
      	.map((elem) => {
      	  if(elem.item == this.selectedItem.item){
      	  		elem.orders = this.selectedItem.orders;
      	  		elem.quantity = this.selectedItem.quantity;
              elem.totalPrice = Number(this.selectedItem.totalPrice);
      	  }
      	  newInventry[newInventry.length] = elem;
		  return elem;
	  });
      this.selectedTaskData.inventory = newInventry;

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
      this.selectedTaskData.inventory
      	.map((elem) => {
      	  if(elem.item == this.selectedItem.item){
      	  		elem.orders = this.selectedItem.orders;
      	  }
      	  newInventry[newInventry.length] = elem;
		  return elem;
	  });
      this.selectedTaskData.inventory = newInventry;

	  this.saveData();	
  }

  payBill(selectedOrder){
    if(!this.isLocked){
      this.isLocked = true;
      var newInventory = [];
      this.selectedTaskData.inventory
          .map((elem) => {
          for (var i in elem.orders) {
              if(elem.orders[i].orderId == selectedOrder.orderId){
                  if(elem.orders[i].totalPrice >= Number(selectedOrder.paidAmount) && 
                    (Number(elem.orders[i].totalPrice) - Number(selectedOrder.ballance)) >= 0){
                    elem.orders[i].payments.push({
                        paymentId: this.getRandomInt(10000000000, 99999999999),
                        payment: Number(selectedOrder.paidAmount),
                        paidBy: this.userId,
                        paymentDate: new Date()
                    });
                    elem.orders[i].totalPayment = Number(elem.orders[i].totalPayment) + Number(selectedOrder.paidAmount);
                    elem.totalPayment = Number(elem.totalPayment) + Number(selectedOrder.paidAmount);
                  } else {
                    selectedOrder.paidAmount = 0;
                    let invalidPaymentAlert = this.alertCtrl.create({
                        title: 'Error',
                        subTitle: 'Invalid Amount',
                        buttons: ['ok']
                    });
                    invalidPaymentAlert.present();
                    return;
                  }
              }
          }
          newInventory[newInventory.length] = elem;
          return elem;
      });
      if(Number(selectedOrder.paidAmount) > 0 ){
          this.selectedTaskData.inventory = newInventory;
          selectedOrder.paidAmount = 0;
          this.saveData();
      } else this.isLocked = false;   
    }
  }

  setBallance(selectedOrder){
    selectedOrder.ballance = Number(selectedOrder.totalPrice) - Number(selectedOrder.totalPayment) - Number(selectedOrder.paidAmount);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryOrdersPage');
  }

}
