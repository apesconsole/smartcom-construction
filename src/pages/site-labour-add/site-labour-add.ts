import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-site-labour-add',
  templateUrl: 'site-labour-add.html',
})
export class SiteLabourAddPage {

  userId: string;
  message: string;
  selectedSite: string;
  selectedTask: string;
  selectedTaskData = {
    siteId: '',
    taskId: '',
    labour: []
  };

  labourData = {
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
  	createDate: new Date(),
  	createdBy: '',
	  updatedBy: '',
	  updateDate: '',
	  approvedBy: '',
	  approvalDate: '',
	  approved: false,
	  active: true
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

  contractTypeList = [
      {value: 'per_hour',  text: 'Hourly'},
      {value: 'per_day',   text: 'Daily' },
      {value: 'per_week',  text: 'Weeky' },
      {value: 'per_month', text: 'Monthy'},
      {value: 'full_payout', text: 'Full Payout'},
      {value: 'partial_payout', text: 'Partial Payout'}
  ];

  getRandomInt(min, max) {
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return 'LBRID' + String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
     this.userId = this.navParams.get('userId');
	   this.selectedTaskData = this.navParams.get('selectedTaskData');
     this.displayText = this.navParams.get('displayText');
	   this.selectedSite = this.selectedTaskData.siteId;
     this.selectedTask = this.selectedTaskData.taskId;
     this.labourData.labourId = this.getRandomInt(10000000000, 99999999999);
  }

  saveField(){
      this.authservice.addlabour(this.labourData, this.selectedSite, this.selectedTask, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                var dataEditAlert = this.alertCtrl.create({
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

  addLabour(){
      if(!this.isLocked){
        this.isLocked = true;
        this.saveField();
      }    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourAddPage');
  }

}
