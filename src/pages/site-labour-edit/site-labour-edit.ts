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
	contractor: '',
	contractType: '',
	rate: 0,
	currency: 'INR',
	count: 0,
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

  contractTypeList = [
      {value: 'per_hour',  text: 'Hourly'},
      {value: 'per_day',   text: 'Daily' },
      {value: 'per_week',  text: 'Weeky' },
      {value: 'per_month', text: 'Monthy'},
      {value: 'full_payout', text: 'Full Payout'},
      {value: 'partial_payout', text: 'Partial Payout'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
      this.userId = this.navParams.get('userId');
      //Task Data Contains the Specific Task Labour
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedLabour = this.navParams.get('selectedLabour');
	  this.canApprove = this.navParams.get('canApprove');
    this.canCreateNewLabour = this.navParams.get('canCreateNew');
    if(this.canApprove && this.selectedLabour.billing.length > 0){
      this.evaluateBillStatus();
    }
    else if(this.canApprove) this.canCreateBill = true; 

    events.subscribe('evaluateCreateBilling', () => {
        this.evaluateBillStatus();
    });

  }

  evaluateBillStatus(){
      this.canCreateBill = true;
      if(!this.canCreateNewLabour){
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

  saveData(){
      this.authservice.savesitelabour(this.selectedTaskData).then(
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

  editLabour(){
    if(!this.isLocked){
      this.isLocked = true;
      var newLabour = [];
      this.selectedTaskData.labour
        .map((elem) => {
          if(elem.labourId == this.selectedLabour.labourId){
              elem.contractor = this.selectedLabour.contractor;
              elem.contractType = this.selectedLabour.contractType;
              elem.rate = this.selectedLabour.rate;
              elem.currency = this.selectedLabour.currency;
              elem.count = this.selectedLabour.count;
              elem.updatedBy = this.userId;
              elem.updateDate = new Date();
              console.log('Changed -> ' + elem.labourId);
          }
          newLabour[newLabour.length] = elem;
          return elem;
      });
      this.selectedTaskData.labour = newLabour;
      this.saveData();
    }
  }

  approveLabour(){
    if(!this.isLocked){
      this.isLocked = true;
      var newLabour = [];
      this.selectedTaskData.labour
        .map((elem) => {
          if(elem.labourId == this.selectedLabour.labourId){
              elem.approved = true;
              elem.approvedBy = this.userId;
              elem.approvalDate = new Date();
              console.log('Changed -> ' + elem.labourId);
          }
          newLabour[newLabour.length] = elem;
          return elem;
      });
      this.selectedTaskData.labour = newLabour;
      this.saveData();
    }
  } 

  addLabourBilling(){
    this.navCtrl.push(SiteLabourAddBillingPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedLabour: this.selectedLabour     
    });  
  }

  editLabourBilling(){
    this.navCtrl.push(SiteLabourEditBillingPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userId,
        selectedLabour: this.selectedLabour     
    });  
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourEditPage');
  }

}
