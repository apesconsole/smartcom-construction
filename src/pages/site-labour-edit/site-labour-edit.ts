import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

import { SiteLabourAddBillingPage } from '../site-labour-add-billing/site-labour-add-billing';
import { SiteLabourEditBillingPage } from '../site-labour-edit-billing/site-labour-edit-billing';


@IonicPage()
@Component({
  selector: 'page-site-labour-edit',
  templateUrl: 'site-labour-edit.html',
})
export class SiteLabourEditPage {
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
  serverData: any;
  isLocked = false;
  canApprove = false;
  canCreateNewLabour = true;
  canCreateBill = false;

  notificationData = {
    key: '',
    subject: '',
    message: ''
  }

  displayText = {
    siteName: '',
    taskDescription: ''
  }

  permission = [];

  contractTypeList = [
      {value: 'per_hour',  text: 'Hourly'},
      {value: 'per_day',   text: 'Daily' },
      {value: 'per_week',  text: 'Weeky' },
      {value: 'per_month', text: 'Monthy'},
      {value: 'full_payout', text: 'Full Payout'},
      {value: 'partial_payout', text: 'Partial Payout'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
    this.events.unsubscribe('evaluateCreateBilling');
    this.events.unsubscribe('refreshLabourBilling');
    this.events.unsubscribe('refreshLabour');
    
    this.userId = this.navParams.get('userId');
      //Task Data Contains the Specific Task Labour
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedLabour = this.navParams.get('selectedLabour');
	  this.canApprove = this.navParams.get('canApprove');
    this.canCreateNewLabour = this.navParams.get('canCreateNew');
    this.permission = this.navParams.get('permission');
    this.displayText = this.navParams.get('displayText');
    if(this.canApprove && this.selectedLabour.billing.length > 0){
        this.evaluateBillStatus();
    }
    else if(this.canApprove) this.canCreateBill = true; 

    this.events.subscribe('evaluateCreateBilling', () => {
        this.evaluateBillStatus();
    });

    this.events.subscribe('refreshLabourBilling', (_freshData) => {
        this.selectedLabour.billing = _freshData;
        this.evaluateBillStatus();
    });
    this.events.subscribe('refreshLabour', (_labourData) => {
        this.selectedLabour.totalBill = Number(_labourData.totalBill); 
        this.selectedLabour.totalPayment = Number(_labourData.totalPayment); 
    }); 

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

  canCreateNewBill(){
    let createNewBill = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedSite){
            createNewBill = elem.createBill;
            return;
        }
        return elem;
    });
    return createNewBill;
  }

  evaluateBillStatus(){
      this.canCreateBill = true;
      if(!this.canCreateNewLabour){
          this.canCreateBill = false;
          return;
      } 
      if(!this.canCreateNewBill()){
          this.canCreateBill = false;
          return;
      }
      this.selectedLabour.billing
        .map((elem) => {
          if(this.canCreateBill && !elem.approved){
              this.canCreateBill = false; 
          }
          return elem;
      });
  }

  editData(){
      this.authservice.editlabour(this.selectedLabour, this.selectedSite, this.selectedTask, this.notificationData).then(
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

  editLabour(){
    if(!this.isLocked){
      this.isLocked = true;
      this.notificationData.key = 'task_labour_edit_info';
      this.notificationData.subject = 'Labour Information Updated';
      this.notificationData.message = 'Labour Information Updated \r\n Updated By:' + this.userId + '\r\n Site Id:' + this.selectedSite + '\r\n Labour Id:' + this.selectedLabour.labourId + '\r\n Description:' + this.selectedLabour.labourDescription + '\r\n Head Count:' + this.selectedLabour.count + '\r\n Rate:' + this.selectedLabour.currency + ' ' + this.selectedLabour.rate;
      this.editData();
    }
  }

  activateLabour(){
    if(!this.isLocked){
      this.isLocked = true;
      this.selectedLabour.active = true;
      this.notificationData.key = '';
      this.editData();
    }
  }

  deActivateLabour(){
    if(!this.isLocked){
      this.isLocked = true;
      this.selectedLabour.active = false;
      this.notificationData.key = '';
      this.editData();
    }
  }

  approveLabour(){
    if(!this.isLocked){
      this.isLocked = true;
      this.selectedLabour.approved = true;
      this.notificationData.key = 'task_labour_approval_info';
      this.notificationData.subject = 'Labour Information Approved';
      this.notificationData.message = 'Labour Information Approved \r\n Labour Approved By:' + this.userId + '\r\n Site Id:' + this.selectedSite + '\r\n Labour Id:' + this.selectedLabour.labourId + '\r\n Description:' + this.selectedLabour.labourDescription + '\r\n Head Count:' + this.selectedLabour.count + '\r\n Rate:' + this.selectedLabour.currency + ' ' + this.selectedLabour.rate;
      this.editData();
    }
  } 

  addLabourBilling(){
    this.navCtrl.push(SiteLabourAddBillingPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedLabour: this.selectedLabour,
        permission: this.permission,
        displayText: this.displayText     
    });  
  }

  editLabourBilling(){
    this.navCtrl.push(SiteLabourEditBillingPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedLabour: this.selectedLabour,
        permission: this.permission,
        displayText: this.displayText     
    });  
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourEditPage');
  }

}
