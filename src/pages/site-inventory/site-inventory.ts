import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, Events } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';
import { SiteCreateTaskPage } from '../site-create-task/site-create-task';
import { SiteEditTaskPage } from '../site-edit-task/site-edit-task';
import { SiteInventoryTaskPage } from '../site-inventory-task/site-inventory-task';

@IonicPage()
@Component({
  selector: 'page-site-inventory',
  templateUrl: 'site-inventory.html',
})
export class SiteInventoryPage {

  userData: any;
  message: string ;
  siteData: any;
  sites = [];
  tasks = [];
  selectedSite: string;
  selectedTask: string;

  canCreateNew = true;

  selectedSiteData = {
    siteId:'',
    siteName: '',
    taskList: []
  }

  displayTask = false;

  permission = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService, public events: Events) {
      this.events.unsubscribe('refreshSiteData');
    	this.userData = authservice.getDisplayinfo();
      this.loadSiteInfo(null, null);
      this.events.subscribe('refreshSiteData', (defaultSite) => {
          this.loadSiteInfo(defaultSite, null);
      });
  }

  doRefresh(refresher) {
    this.loadSiteInfo(null, function(){
      refresher.complete();
    });
  }

  loadSiteInfo(defaultSite, refresherCallBak){
    this.selectedSite = '';
    this.selectedTask = '';
    this.displayTask = false;
    this.authservice.constructionsites().then(
    data => {
        if(null != refresherCallBak) refresherCallBak();
        this.siteData = data;
        this.permission = this.siteData.permission;
        this.sites = this.siteData.data;
        if(null != defaultSite) this.displaySite(defaultSite);
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });
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

  displaySite(defaultSite){
      let _defaultSiteData = {siteId: ''};
      this.sites.map((s) => {
        if(s.siteId == defaultSite){
            _defaultSiteData = s;
        }
        return s;
      });
      if(_defaultSiteData.siteId == defaultSite) this.loadTasks(_defaultSiteData);
  }

  loadTasks(site){
    this.selectedSite = site.siteId;
    this.displayTask = true;
    this.selectedSiteData = site; 
    this.tasks = this.selectedSiteData.taskList;
  } 

  addtask(){
    this.navCtrl.push(SiteCreateTaskPage, {
        selectedSiteData: this.selectedSiteData,
        userId: this.userData.userId       
    });
  }

  loadTaskDetails(task){
    this.navCtrl.push(SiteEditTaskPage, {
        selectedSiteData: this.selectedSiteData,
        selectedTaskData: task,
        userId: this.userData.userId,
        permission: this.permission      
    });   
  } 

  loadInventoryDetail(task){
    this.navCtrl.push(SiteInventoryTaskPage, {
        displayInventroy: true,
        selectedSiteData: this.selectedSiteData,
        selectedTaskData: task,
        userId: this.userData.userId,
        permission: this.permission      
    }); 
  }

  loadLabourDetail(task){
    this.navCtrl.push(SiteInventoryTaskPage, {
        displayLabour: true,
        selectedSiteData: this.selectedSiteData,
        selectedTaskData: task,
        userId: this.userData.userId,
        permission: this.permission      
    }); 
  }

  getTotalCost(task){
      return Number(task.actualInventoryCost) + Number(task.actualLabourCost);
  }

  getTotalPayment(task){
      return Number(task.totalInventoryPayment) + Number(task.totalLabourPayment);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryPage');
    this.menu.swipeEnable(true, 'menu'); 
  }


}
