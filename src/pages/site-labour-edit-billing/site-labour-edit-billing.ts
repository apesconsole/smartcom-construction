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
      ballance: 0,
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

  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
      this.userId = this.navParams.get('userId');
      //Task Data Contains the Specific Task Labour
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedLabour = this.navParams.get('selectedLabour');
    this.permission = this.navParams.get('permission');
    this.bill.paidAmount = 0;
  }

  saveData(){
      this.authservice.savesitelabour(this.selectedTaskData, this.notificationData).then(
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
            this.events.publish('evaluateCreateBilling');
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  removeBilling(selectedBill){
  	if(!this.isLocked){
  		this.isLocked = true;
	    var newLabour = [];
	    this.selectedTaskData.labour
	        .map((elem) => {
	          if(elem.labourId == this.selectedLabour.labourId){
    			     let index = elem.billing.indexOf(selectedBill);
    			     if(index > -1){
    			        elem.billing.splice(index, 1);
    			     }
	          }
	          newLabour[newLabour.length] = elem;
	          return elem;
	    });
	    this.selectedTaskData.labour = newLabour;
	    this.saveData();
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
	    var newLabour = [];
	    this.selectedTaskData.labour
	        .map((elem) => {
	          if(elem.labourId == this.selectedLabour.labourId){
	          	for (var i in elem.billing) {
          	 		if(elem.billing[i].billingId ==  eval(selectedBill.billingId)){
          	 			console.log(selectedBill.billingId);
                  elem.totalBill = Number(elem.totalBill) + Number(elem.billing[i].billingAmount);
          	 			elem.billing[i].approved = true;
          	 			elem.billing[i].approvedBy = this.userId;
						      elem.billing[i].approvalDate = new Date();
          	 		}
	          	}
	          }
	          newLabour[newLabour.length] = elem;
	          return elem;
	    });
	    this.selectedTaskData.labour = newLabour;

      this.notificationData.key = 'task_labour_bill_approval_info';
      this.notificationData.subject = 'Labour Bill Approved';
      this.notificationData.message = 'Labour Bill Approved  \r\n Bill Approved By:' + this.userId + '\r\n Site Id:' + this.selectedSite + '\r\n Labour: ' + this.selectedLabour.labourDescription  + '\r\n Billing Id:' + selectedBill.billingId + '\r\n Total Bill:' + selectedBill.currency + ' ' + selectedBill.billingAmount;

	    this.saveData();
  	}
  }

  updateBilling(selectedBill){
  	if(!this.isLocked){
  		this.isLocked = true;
	    var newLabour = [];
	    this.selectedTaskData.labour
	        .map((elem) => {
	          if(elem.labourId == this.selectedLabour.labourId){
	          	for (var i in elem.billing) {
          	 		if(elem.billing[i].billingId ==  eval(selectedBill.billingId)){
          	 			console.log(selectedBill.billingId);
          	 			elem.billing[i].billingAmount = selectedBill.billingAmount;
          	 			elem.billing[i].invoice = selectedBill.invoice;
          	 			elem.billing[i].updatedBy = this.userId;
						      elem.billing[i].updateDate = new Date();
          	 		}
	          	}
	          }
	          newLabour[newLabour.length] = elem;
	          return elem;
	    });
	    this.selectedTaskData.labour = newLabour;
	    this.saveData();
  	}
  }

  payBill(selectedBill){
    if(!this.isLocked){
      this.isLocked = true;
      var newLabour = [];
      this.selectedTaskData.labour
          .map((elem) => {
            if(elem.labourId == this.selectedLabour.labourId){
              for (var i in elem.billing) {
                if(elem.billing[i].billingId ==  eval(selectedBill.billingId)){
                  if(elem.billing[i].billingAmount >= Number(selectedBill.paidAmount) && 
                    (Number(elem.billing[i].billingAmount) - Number(selectedBill.ballance)) >= 0){
                    elem.billing[i].payments.push({
                        paymentId: this.getRandomInt(10000000000, 99999999999),
                        payment: Number(selectedBill.paidAmount),
                        paidBy: this.userId,
                        paymentDate: new Date()
                    });
                    elem.billing[i].totalPayment = Number(elem.billing[i].totalPayment) + Number(selectedBill.paidAmount);
                    elem.totalPayment = Number(elem.totalPayment) + Number(selectedBill.paidAmount);
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
                }
              }
            }
            newLabour[newLabour.length] = elem;
            return elem;
      });
      if(Number(selectedBill.paidAmount) > 0 ){
          this.selectedTaskData.labour = newLabour;
          selectedBill.paidAmount = 0;

          this.notificationData.key = 'task_labour_bill_payment_info';
          this.notificationData.subject = 'Labour Bill Payment Notification';
          this.notificationData.message = 'Labour Bill Payment  \r\n Payment Updated By:' + this.userId + '\r\n Site Id:' + this.selectedSite + '\r\n Labour: ' + this.selectedLabour.labourDescription  + '\r\n Billing Id:' + selectedBill.billingId + '\r\n Total Bill:' + selectedBill.currency + ' ' + selectedBill.billingAmount + '\n\r Paid Amount:' + selectedBill.currency + ' ' + selectedBill.paidAmount + '\r\n Remaining Amount:' + selectedBill.currency + ' ' + selectedBill.ballance;

          this.saveData();
      } else this.isLocked = false;   
    }
  }

  setBallance(selectedBill){
    selectedBill.ballance = Number(selectedBill.billingAmount) - Number(selectedBill.totalPayment) - Number(selectedBill.paidAmount);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourEditBillingPage');
  }

}
