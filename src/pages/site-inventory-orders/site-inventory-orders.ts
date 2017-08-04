import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

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
     ballance: 0,
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
  
  permission = [];

  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return 'ORDPMTID' + String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  setTotalPrice(orderDetails){
      orderDetails.totalPrice = Number(orderDetails.quantity * orderDetails.unitPrice) + Number(orderDetails.tax);
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
    this.userId = this.navParams.get('userId');
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedItem = this.navParams.get('selectedItem');
    this.permission = this.navParams.get('permission');
	  this.canApprove = this.navParams.get('canApprove');
    this.displayText = this.navParams.get('displayText');
  }

  canPay(){
    let pay = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedSite){
            pay =  elem.pay;
            return;
        }
        return elem;
    });
    return pay;
  }

  deleteData(order){
      this.authservice.deleteinventoryorder(this.selectedItem.item, order, this.selectedSite, this.selectedTask, this.notificationData).then(
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

  deleteOrder(order){
    if(!this.isLocked) {
        this.isLocked = true;
        this.deleteData(order);
    }
  }

  completeData(order){
      this.authservice.completeinventoryorder(this.selectedItem.item, order, this.selectedSite, this.selectedTask, this.notificationData).then(
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

  approveData(order){
      this.authservice.approveinventoryorder(this.selectedItem.item, order, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshInventoryOrder', this.serverData.item.orders); 
                this.events.publish('refreshInventoryItem', {
                    quantity: this.serverData.item.quantity,
                    totalPrice: this.serverData.item.totalPrice,
                    totalPayment: this.serverData.item.totalPayment
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

  completeOrder(order){
    if(!this.isLocked){
      this.isLocked = true;    
      this.notificationData.key = 'task_inventory_approval_request';
      this.notificationData.subject = 'Order Approval Request';
      this.notificationData.message = 'Order Approval Request \r\n Order Created By:' + this.userId + '\r\n Site:' + this.displayText.siteName + '\r\n Task:' + this.displayText.taskDescription + '\r\n Order Id:' + order.orderId + '\r\n Ordered Item:' + order.item + '\r\n Total Items:' + order.quantity + '\r\n Total Price:' + order.currency + ' ' + order.totalPrice;
      this.completeData(order);  
    }
  }

  approveOrder(order){
    if(!this.isLocked){
      this.isLocked = true;
      this.notificationData.key = 'task_inventory_approval_info';
      this.notificationData.subject = 'Order Approved Notification';
      this.notificationData.message = 'Order Approved \r\n Order Approved By:' + this.userId + '\r\n Site:' + this.displayText.siteName + '\r\n Task:' + this.displayText.taskDescription + '\r\n Order Id:' + order.orderId + '\r\n Ordered Item:' + order.item + '\r\n Total Items:' + order.quantity + '\r\n Total Price:' + order.currency + ' ' + order.totalPrice;
  	  this.approveData(order);
    }	

  }

  savePaymentData(order, paymentData){
      this.authservice.payinventoryorder(this.selectedItem.item, order.orderId, paymentData, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation && !this.serverData.dispute) {
                let paymentEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshInventoryOrder', this.serverData.item.orders); 
                this.events.publish('refreshInventoryItem', {
                    quantity: this.serverData.item.quantity,
                    totalPrice: this.serverData.item.totalPrice,
                    totalPayment: this.serverData.item.totalPayment
                }); 
                paymentEditAlert.present();
            } else if(this.serverData.operation && this.serverData.dispute) {
                var peymentEditFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Payment coyld not be processed. Some one already processed a payment towards the selected Order. Kindly refresh to see latest payment ballances',
                    buttons: ['ok']
                });
                peymentEditFailureAlert.present();
            } else {
                var peymentEditFailureAlert_2 = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Data Not Saved',
                    buttons: ['ok']
                });
                peymentEditFailureAlert_2.present();
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

  payBill(selectedOrder){
    if(!this.isLocked){
      this.isLocked = true;
      let paymentData = {
        paymentId: '',
        paidAmount: 0
      };
      this.selectedTaskData.inventory
          .map((elem) => {
          for (var i in elem.orders) {
              if(elem.orders[i].orderId == selectedOrder.orderId){
                  if(elem.orders[i].totalPrice >= Number(selectedOrder.paidAmount) && 
                    (Number(elem.orders[i].totalPrice) - Number(selectedOrder.ballance)) >= 0){
                      //Payment OK
                      paymentData.paymentId = this.getRandomInt(10000000000, 99999999999);
                      paymentData.paidAmount = Number(selectedOrder.paidAmount);
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
                  return;
              }
          }
          return elem;
      });
      if(Number(selectedOrder.paidAmount) > 0 ){
          selectedOrder.paidAmount = 0;

          this.notificationData.key = 'task_inventory_order_payment_info';
          this.notificationData.subject = 'Order Bill Payment Notification';
          this.notificationData.message = 'Order Bill Payment  \r\n Payment Updated By:' + this.userId + '\r\n Site:' + this.displayText.siteName + '\r\n Task:' + this.displayText.taskDescription + '\r\n Order Id:' + selectedOrder.orderId + '\r\n Ordered Item:' + selectedOrder.item + '\r\n Total Price:' + selectedOrder.currency + ' ' + selectedOrder.totalPrice + '\n\r Paid Amount:' + selectedOrder.currency + ' ' + selectedOrder.paidAmount + '\r\n Remaining Amount:' + selectedOrder.currency + ' ' + selectedOrder.ballance;

          this.savePaymentData(selectedOrder, paymentData);
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
