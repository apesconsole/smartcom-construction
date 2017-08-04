import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-site-labour-add-billing',
  templateUrl: 'site-labour-add-billing.html',
})
export class SiteLabourAddBillingPage {
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

  billingDetail = {
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
  	  approved: false
  }
  serverData: any;
  isLocked = false;

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
    return 'LBRBILLID' + String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
      this.userId = this.navParams.get('userId');
      //Task Data Contains the Specific Task Labour
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
    this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedLabour = this.navParams.get('selectedLabour');
	  this.billingDetail.createdBy = this.userId;
    this.displayText = this.navParams.get('displayText');
	  this.billingDetail.billingId = this.getRandomInt(10000000000, 99999999999);
  }

  addBillingData(){
      this.authservice.addlabourbilling(this.selectedLabour.labourId, this.billingDetail, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let dataEditAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                this.events.publish('refreshLabourBilling', this.serverData.labour.billing); 
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

  addBilling(){
  	if(!this.isLocked){
  		this.isLocked = true;

      this.notificationData.key = 'task_labour_bill_create_info';
      this.notificationData.subject = 'Labour Bill Notification';
      this.notificationData.message = 'Labour Bill  \r\n Bill Created By:' + this.userId + '\r\n Site:' + this.displayText.siteName + '\r\n Task:' + this.displayText.taskDescription + '\r\n Labour Id:' + this.selectedLabour.labourId + '\r\n Labour Description:' + this.selectedLabour.labourDescription + '\r\n Total Bill:' + this.billingDetail.currency + ' ' + this.billingDetail.billingAmount;
	    this.addBillingData();
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourAddBillingPage');
  }

}
