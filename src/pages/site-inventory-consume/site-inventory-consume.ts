import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, Events } from 'ionic-angular';

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
    siteName: '',
    taskList: []
  }
  selectedTaskData = {
    siteId: '',
    taskId: '',
    inventory: []
  };
  inventory = [];
  permission = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService, public events: Events) {
      this.userData = authservice.getDisplayinfo();
      this.loadSiteInfo(null);
      this.events.subscribe('refreshInventoryConsumption', (_itemData) => {
          this.loadInventoryDetail(this.selectedTask);
      });
  }

  doRefresh(refresher) {
    this.loadSiteInfo(function(){
      refresher.complete();
    });
  }

  loadSiteInfo(refresherCallBak){
    this.selectedSite = '';
    this.selectedTask = '';  
    this.displayTask = false;
    this.displayInventroy = false;    
    this.authservice.constructionsites().then(
    data => {
        if(null != refresherCallBak) refresherCallBak();
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

  loadInventoryDetail(taskId){
    this.selectedTask = taskId;
    this.displayInventroy = true;
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
