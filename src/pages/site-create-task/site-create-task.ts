import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

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
	estimatedDays: '', 
	daysRemaining: '', 
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

  serverData: any;
  isLocked = false;

  getRandomInt(min, max) {
  	var _min = Math.ceil(min);
  	var _max = Math.floor(max);
  	return String(Math.floor(Math.random() * (_max - _min)) + _min); //The maximum is exclusive and the minimum is inclusive
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController){
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
      this.authservice.createtask(this.selectedSiteData, this.taskInventory, this.taskLabour).then(
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
            this.navCtrl.pop();
        }, error => {
           this.navCtrl.setRoot(LoginPage);
           this.message = error.message;
      }); 
  }

  createTask(){
    if(!this.isLocked){
        this.isLocked = true;
        this.taskDetails.daysRemaining = this.taskDetails.estimatedDays;
        this.selectedSiteData.taskList.push(this.taskDetails);
  	    this.saveData();	
    }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteCreateTaskPage');
  }

}
