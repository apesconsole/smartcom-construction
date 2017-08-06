import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController , Events} from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-site-labour-edit-billing',
  templateUrl: 'site-labour-edit-billing.html',
})
export class SiteLabourEditBillingPage {
  userId: string;
  message: string;
  selectedSite: string;
  selectedTask: string;
  selectedTaskData = {
  	siteId: '',
    taskId: '',
  	labour : []
  };
  selectedLabour = {
	  labourId: '',
    labourDescription: '',
	  contractor: '',
	  contractType: '',
	  rate: 0,
	  currency: 'INR',
	  count: 0,
    totalBill: 0,
    totalPayment: 0,
    billing: [],
	  createDate: '',
	  createdBy: '',
	  updatedBy: '',
	  updateDate: new Date(),
	  approvedBy: '',
	  approvalDate: '',
	  approved: false,
	  active: true
  }

  bill = {
      billingId: '',
      billingAmount: 0,
      invoice: '',
      currency: 'INR',
      totalPayment: 0,
      payments: [],
      createDate: new Date(),
      createdBy: '',
      updatedBy: '',
      updateDate: '',
      approvedBy: '',
      approvalDate: '',
      approved: false,
      balance: 0,
      paidAmount: 0
  }

  serverData: any;
  isLocked = false;

  notificationData = {
    key: '',
    subject: '',
    message: ''
  }

  permission = [];

  displayText = {
    siteName: '',
    taskDescription: ''
  }
  
  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return 'LBRPMTPD' + String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
      this.userId = this.navParams.get('userId');
      //Task Data Contains the Specific Task Labour
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedLabour = this.navParams.get('selectedLabour');
    this.permission = this.navParams.get('permission');
    this.displayText = this.navParams.get('displayText');
    this.bill.paidAmount = 0;
  }

  deleteData(selectedBill){
      this.authservice.deletelabourbill(this.selectedLabour.labourId, selectedBill.billingId, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshLabourBilling', this.serverData.labour.billing); 
                this.events.publish('refreshLabour', {
                    totalBill: this.serverData.labour.totalBill,
                    totalPayment: this.serverData.labour.totalPayment
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
            this.events.publish('evaluateCreateBilling');
            this.events.publish('refreshSiteData', this.selectedSite);
            this.events.publish('refreshLabourData', {
                siteId: this.selectedSite, 
                taskId: this.selectedTask
            });             
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  updateData(selectedBill){
      this.authservice.editlabourbill(this.selectedLabour.labourId, selectedBill, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshLabourBilling', this.serverData.labour.billing); 
                this.events.publish('refreshLabour', {
                    totalBill: this.serverData.labour.totalBill,
                    totalPayment: this.serverData.labour.totalPayment
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
            this.events.publish('evaluateCreateBilling');
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  approveBillingData(selectedBill){
      this.authservice.approvelabourbill(this.selectedLabour.labourId, selectedBill.billingId, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshLabourBilling', this.serverData.labour.billing); 
                this.events.publish('refreshLabour', {
                    totalBill: this.serverData.labour.totalBill,
                    totalPayment: this.serverData.labour.totalPayment
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
            this.events.publish('evaluateCreateBilling');
            this.events.publish('refreshSiteData', this.selectedSite);
            this.events.publish('refreshLabourData', {
                siteId: this.selectedSite, 
                taskId: this.selectedTask
            });              
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  savePaymentData(selectedBill, paymentData){
      this.authservice.paylabourbill(this.selectedLabour.labourId, selectedBill.billingId, paymentData, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation && !this.serverData.dispute) {
                let paymentEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshLabourBilling', this.serverData.labour.billing); 
                this.events.publish('refreshLabour', {
                    totalBill: this.serverData.labour.totalBill,
                    totalPayment: this.serverData.labour.totalPayment
                });  
                paymentEditAlert.present();
            } else if(this.serverData.operation && this.serverData.dispute) {
                var peymentEditFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Payment coyld not be processed. Some one already processed a payment towards the selected Labour Bill. Kindly refresh to see latest payment balances',
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
            this.events.publish('evaluateCreateBilling');
            this.events.publish('refreshSiteData', this.selectedSite);
            this.events.publish('refreshLabourData', {
                siteId: this.selectedSite, 
                taskId: this.selectedTask
            });            
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  deleteBilling(selectedBill){
  	if(!this.isLocked){
  		this.isLocked = true;
	    this.deleteData(selectedBill);
  	}
  }

  canApproveBill(){
    let canApprove = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedSite){
            canApprove = elem.approve;
            return;
        }
        return elem;
    });
    return canApprove;
  }

  canPayBill(){
    let canPay = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedSite){
            canPay = elem.pay;
            return;
        }
        return elem;
    });
    return canPay;
  }

  approveBilling(selectedBill){
  	if(!this.isLocked){
  		this.isLocked = true;
      this.notificationData.key = 'task_labour_bill_approval_info';
      this.notificationData.subject = 'Labour Bill Approved';
      this.notificationData.message = 'Labour Bill Approved  \r\n Bill Approved By:' + this.userId + '\r\n Site Id:' + this.selectedSite + '\r\n Labour: ' + this.selectedLabour.labourDescription  + '\r\n Billing Id:' + selectedBill.billingId + '\r\n Total Bill:' + selectedBill.currency + ' ' + selectedBill.billingAmount;
	    this.approveBillingData(selectedBill);
  	}
  }

  updateBilling(selectedBill){
  	if(!this.isLocked){
  		this.isLocked = true;
	    this.updateData(selectedBill);
  	}
  }

  payBill(selectedBill){
    if(!this.isLocked){
      this.isLocked = true;
      let paymentData = {
          paymentId: '',
          paidAmount: 0
      };
      this.selectedTaskData.labour
          .map((elem) => {
            if(elem.labourId == this.selectedLabour.labourId){
              for (var i in elem.billing) {
                if(elem.billing[i].billingId ==  selectedBill.billingId){
                  if(elem.billing[i].billingAmount >= Number(selectedBill.paidAmount) && 
                    (Number(elem.billing[i].billingAmount) - Number(selectedBill.balance)) >= 0){
                    
                        paymentData.paymentId = this.getRandomInt(10000000000, 99999999999);
                        paymentData.paidAmount = Number(selectedBill.paidAmount);

                  } else {
                    selectedBill.paidAmount = 0;
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
            }
            return elem;
      });
      if(Number(selectedBill.paidAmount) > 0 ){
          selectedBill.paidAmount = 0;

          this.notificationData.key = 'task_labour_bill_payment_info';
          this.notificationData.subject = 'Labour Bill Payment Notification';
          this.notificationData.message = 'Labour Bill Payment  \r\n Payment Updated By:' + this.userId + '\r\n Site Id:' + this.selectedSite + '\r\n Labour: ' + this.selectedLabour.labourDescription  + '\r\n Billing Id:' + selectedBill.billingId + '\r\n Total Bill:' + selectedBill.currency + ' ' + selectedBill.billingAmount + '\n\r Paid Amount:' + selectedBill.currency + ' ' + selectedBill.paidAmount + '\r\n Remaining Amount:' + selectedBill.currency + ' ' + selectedBill.balance;

          this.savePaymentData(selectedBill, paymentData);
      } else this.isLocked = false;   
    }
  }

  setBalance(selectedBill){
    selectedBill.balance = Number(selectedBill.billingAmount) - Number(selectedBill.totalPayment) - Number(selectedBill.paidAmount);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourEditBillingPage');
  }

}
