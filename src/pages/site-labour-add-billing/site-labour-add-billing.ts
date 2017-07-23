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
	  this.billingDetail.createdBy = this.userId;
	  this.billingDetail.billingId = this.getRandomInt(10000000000, 99999999999);
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
            this.events.publish('evaluateCreateBilling');
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  addBilling(){
  	if(!this.isLocked){
  		this.isLocked = true;
	    var newLabour = [];
	    this.selectedTaskData.labour
	        .map((elem) => {
	          if(elem.labourId == this.selectedLabour.labourId){
	             elem.billing.push(this.billingDetail); 
	             console.log(elem.labourId)
	          }
	          newLabour[newLabour.length] = elem;
	          return elem;
	    });
	    this.selectedTaskData.labour = newLabour;
	    this.saveData();
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourAddBillingPage');
  }

}
