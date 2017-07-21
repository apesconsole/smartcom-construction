import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
    actualCost: 0,
  	estimatedDays: '', 
  	daysRemaining: '', 
  	taskStatus: 'Waiting',
  	createDate: Date,
  	createdBy: '',
  	updateDate: new Date(),
  	updatedBy: '' 	
  }

  serverData: any;
  isLocked = false;

 
  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
      this.userId = this.navParams.get('userId');
	  this.selectedSiteData = this.navParams.get('selectedSiteData');
	  this.taskDetails = this.navParams.get('selectedTaskData');
	  this.taskDetails.updatedBy = this.userId;
	  this.selectedSite = this.selectedSiteData.siteId;
	  this.isLocked = false;
  }

  saveData(){
      this.authservice.edittask(this.selectedSiteData).then(
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

  editTask(){
    if(!this.isLocked){
        this.isLocked = true;
        var newTaskList = [];
        this.selectedSiteData.taskList
      	.map((task) => {
      	  if(task.taskId == this.taskDetails.taskId){
      	  	  task = this.taskDetails;
      	  	  console.log('Changed -> ' + task.taskId);
      	  }
      	  newTaskList[newTaskList.length] = task;
		  return task;
	  	});
      	this.selectedSiteData.taskList = newTaskList;
        this.saveData();
    } 
  }

  editTaskStatus(status){
    if(!this.isLocked){
        this.isLocked = true;
        var newTaskList = [];
        this.selectedSiteData.taskList
      	.map((task) => {
      	  if(task.taskId == this.taskDetails.taskId){
      	  	  task.taskStatus = status;
      	  	  task.updateDate = new Date();
      	  	  task.updatedBy = this.userId;
      	  	  console.log('Changed -> ' + task.taskId);
      	  }
      	  newTaskList[newTaskList.length] = task;
		  return task;
	  	});
      	this.selectedSiteData.taskList = newTaskList;
        this.saveData();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteEditTaskPage');
  }

}
