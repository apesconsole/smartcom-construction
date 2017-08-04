import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-site-create-task',
  templateUrl: 'site-create-task.html',
})
export class SiteCreateTaskPage {
  userId: string;
  message: string;
  selectedSite: string;
  selectedTask: string;
  selectedSiteData = {
    siteId:'',
    taskList: []
  }

  taskDetails = {
  	taskId: '',
  	taskDescription: '', 
    currency: 'INR',
    estimatedCost: 0,
    actualInventoryCost: 0,
    totalInventoryPayment: 0,
    actualLabourCost: 0,
    totalLabourPayment: 0,    
    totalLabour: 0,
    totalInventory: 0,
  	estimatedDays: 0, 
  	daysRemaining: 0, 
  	taskStatus: 'Waiting',
  	createDate: new Date(),
  	createdBy: '',
  	updateDate: Date,
  	updatedBy: '' 	
  }

  taskInventory = {
    siteId: '',
    taskId: '',
    inventory: []
  }

  taskLabour = {
    siteId: '',
    taskId: '',
    labour: []
  }

  notificationData = {
    key: 'task_add_info',
    subject: '',
    message: ''
  }

  serverData: any;
  isLocked = false;

  getRandomInt(min, max) {
  	var _min = Math.ceil(min);
  	var _max = Math.floor(max);
  	return 'TSKID' + String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
        this.userId = this.navParams.get('userId');
	  this.selectedSiteData = this.navParams.get('selectedSiteData');
	  this.isLocked = false;
	  this.selectedSite = this.selectedSiteData.siteId;
	  this.taskDetails.createdBy = this.userId;
	  this.taskDetails.taskId = this.getRandomInt(10000000000, 99999999999);

	  this.taskInventory.siteId = this.selectedSite;
	  this.taskInventory.taskId = this.taskDetails.taskId;

    this.taskLabour.siteId = this.selectedSite;
    this.taskLabour.taskId = this.taskDetails.taskId;
  }

  saveData(){
      this.authservice.createtask(this.selectedSite, this.taskDetails, this.notificationData).then(
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
                this.isLocked = false;
            }
            this.events.publish('refreshSiteData', this.selectedSite);
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  messageBuilder(){
      this.notificationData.subject = 'New Task Added at Site:' + this.selectedSite;
      this.notificationData.message = 'New Task Added \r\n Site Id:' + this.selectedSite +'\r\n Task Id:' + this.taskDetails.taskId + '\r\n Task Description:' + this.taskDetails.taskDescription + '\r\n Created By:' + this.userId;
  }

  createTask(){
    if(!this.isLocked){
        this.isLocked = true;
        this.taskDetails.daysRemaining = this.taskDetails.estimatedDays;
        //this.selectedSiteData.taskList.push(this.taskDetails);
        //Notification Details
        this.messageBuilder();
  	    this.saveData();	
    }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteCreateTaskPage');
  }

}
