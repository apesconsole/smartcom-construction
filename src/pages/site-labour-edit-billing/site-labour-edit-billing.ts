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

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
      this.userId = this.navParams.get('userId');
      //Task Data Contains the Specific Task Labour
	  this.selectedTaskData = this.navParams.get('selectedTaskData');
	  this.selectedSite = this.selectedTaskData.siteId;
      this.selectedTask = this.selectedTaskData.taskId;
	  this.selectedLabour = this.navParams.get('selectedLabour');
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLabourEditBillingPage');
  }

}
