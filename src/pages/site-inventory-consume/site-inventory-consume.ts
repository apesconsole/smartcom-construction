import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

import { SiteInventoryConsumeItemPage } from '../site-inventory-consume-item/site-inventory-consume-item';

@IonicPage()
@Component({
  selector: 'page-site-inventory-consume',
  templateUrl: 'site-inventory-consume.html',
})
export class SiteInventoryConsumePage {
  userData: any;
  message: string ;
  siteData: any;
  sites = [];
  tasks = [];
  selectedSite: string;
  selectedTask: string;
  displayTask = false;
  displayInventroy = false;
  siteInventoryData: any;
  selectedSiteData = {
    siteId:'',
    taskList: []
  }
  selectedTaskData = {
    siteId: '',
    taskId: '',
    inventory: []
  };
  inventory = [];
  permission = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService) {
      this.userData = authservice.getDisplayinfo();
      this.loadSiteInfo();
  }

  loadSiteInfo(){
    this.selectedSite = '';
    this.selectedTask = '';  
    this.displayTask = false;
    this.displayInventroy = false;    
    this.authservice.constructionsites().then(
    data => {
        this.siteData = data;
        this.sites = this.siteData.data;
        this.permission = this.siteData.permission;
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });
  }

  loadTaskDetail(site){
    this.displayTask = true;
    this.displayInventroy = false;
    this.selectedSite = site.siteId;
    this.selectedSiteData = site;
    this.tasks = this.selectedSiteData.taskList;
  } 

  loadInventoryDetail(task){
    this.selectedTask = task.taskId;
    this.displayInventroy = true;
    console.log(this.selectedSiteData.siteId + ', ' + this.selectedTask)
    this.authservice.siteinventory(this.selectedSiteData.siteId, this.selectedTask).then(
    data => {
        this.siteInventoryData = data;
        this.selectedTaskData = this.siteInventoryData.data 
        this.inventory = this.selectedTaskData.inventory;
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });    
  } 

  consumeInventory(item){
    this.navCtrl.push(SiteInventoryConsumeItemPage, {
        selectedTaskData: this.selectedTaskData,
        userId: this.userData.userId,
        selectedItem: item   
    });  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryConsumePage');
  }

}
