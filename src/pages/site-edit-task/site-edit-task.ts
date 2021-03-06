import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-site-edit-task',
  templateUrl: 'site-edit-task.html',
})
export class SiteEditTaskPage {
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
  	daysRemaining: '', 
  	taskStatus: 'Waiting',
  	createDate: Date,
  	createdBy: '',
  	updateDate: new Date(),
  	updatedBy: '' 	
  }

  permission = [];
  serverData: any;
  isLocked = false;

  notificationData = {
    key: 'task_edit_info',
    subject: '',
    message: ''
  }
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
    this.userId = this.navParams.get('userId');
	  this.selectedSiteData = this.navParams.get('selectedSiteData');
	  this.taskDetails = this.navParams.get('selectedTaskData');
	  this.taskDetails.updatedBy = this.userId;
	  this.selectedSite = this.selectedSiteData.siteId;
    this.permission = this.navParams.get('permission');
	  this.isLocked = false;
  }

  viewFinance(siteId){
    let viewFinance = false;
    this.permission.map((elem) => {
        if(elem.siteId == siteId){
            viewFinance =  elem.viewFinance;
            return;
        }
        return elem;
    });
    return viewFinance;
  }

  updateTaskData(){
      this.authservice.updatetask(this.taskDetails, this.selectedSite, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let taskUpdateAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                taskUpdateAlert.present();
            } else {
                var taskUpdateFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Data Not Saved',
                    buttons: ['ok']
                });
                taskUpdateFailureAlert.present();
            }
            this.navCtrl.pop();
            this.events.publish('refreshSiteData', this.selectedSite);
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  updateTaskStatus(){
      this.authservice.updatetaskstatus(this.taskDetails, this.selectedSite, this.notificationData).then(
        data => {
            this.serverData = data;
            if(this.serverData.operation) {
                let taskUpdateAlert = this.alertCtrl.create({
                    title: 'Success',
                    subTitle: 'Data Saved',
                    buttons: ['ok']
                });
                taskUpdateAlert.present();
            } else {
                var taskUpdateFailureAlert = this.alertCtrl.create({
                    title: 'Failure',
                    subTitle: 'Data Not Saved',
                    buttons: ['ok']
                });
                taskUpdateFailureAlert.present();
            }
            this.navCtrl.pop();
            this.events.publish('refreshSiteData', this.selectedSite);
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  editTask(){
    if(!this.isLocked){
        this.isLocked = true;

        this.notificationData.subject = 'Task Updated at Site:' + this.selectedSite;
        this.notificationData.message = 'Task Updated. \r\n Site Id:' + this.selectedSite +'\r\n Task Id:' + this.taskDetails.taskId + '\r\n Task Description:' + this.taskDetails.taskDescription + '\r\n Updated By:' + this.userId;
        this.updateTaskData();
    } 
  }

  editTaskStatus(status){
    if(!this.isLocked){
        this.isLocked = true;
        this.taskDetails.taskStatus = status;
        //Notification
        this.notificationData.subject = 'Task Status Updated at Site:' + this.selectedSite;
        this.notificationData.message = 'Task Status Updated \r\n Site Id:' + this.selectedSite +'\r\n Task Id:' + this.taskDetails.taskId + '\r\n Task Status:' + this.taskDetails.taskStatus + '\r\n Updated By:' + this.userId;        
        this.updateTaskStatus();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteEditTaskPage');
  }

}
