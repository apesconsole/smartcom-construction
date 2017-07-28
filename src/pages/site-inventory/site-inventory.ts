import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, Events } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';
import { SiteCreateTaskPage } from '../site-create-task/site-create-task';
import { SiteEditTaskPage } from '../site-edit-task/site-edit-task';
import { SiteInventoryAddPage } from '../site-inventory-add/site-inventory-add';
import { SiteInventoryEditPage } from '../site-inventory-edit/site-inventory-edit';
import { SiteLabourAddPage } from '../site-labour-add/site-labour-add';
import { SiteLabourEditPage } from '../site-labour-edit/site-labour-edit';

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
  displayTask = false;
  displayInventroy = false;
  displayLabour = false;
  canCreateNew = true;
  siteInventoryData: any;
  siteLabourData: any;
  selectedSiteData = {
    siteId:'',
    taskList: []
  }
  selectedTaskInventoryData = {
    siteId: '',
    taskId: '',
    inventory: []
  };
  selectedTaskLabourData = {
    siteId: '',
    taskId: '',
    labour: []
  };  
  inventory = [];
  labour = [];
  permission = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService, public events: Events) {
    	this.userData = authservice.getDisplayinfo();
      this.loadSiteInfo(null);
      this.events.subscribe('refreshSiteData', (defaultSite) => {
          this.loadSiteInfo(defaultSite);
          console.log(defaultSite);
      });
  }

  loadSiteInfo(defaultSite){
    this.selectedSite = '';
    this.selectedTask = '';
    this.displayTask = false;
    this.displayInventroy = false;
    this.displayLabour = false;
    this.authservice.constructionsites().then(
    data => {
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
      console.log('_defaultSiteData = ' + _defaultSiteData.siteId);
      if(_defaultSiteData.siteId == defaultSite) this.loadTasks(_defaultSiteData);
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

  addinventory(){
    this.navCtrl.push(SiteInventoryAddPage, {
        selectedTaskData: this.selectedTaskInventoryData,
        userId: this.userData.userId       
    });
  }

  editinventory(item){
    var canApprove = false;
    console.log(this.permission);
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedTaskInventoryData.siteId){
            canApprove = elem.approve;
        }
    });
    this.navCtrl.push(SiteInventoryEditPage, {
        selectedTaskData: this.selectedTaskInventoryData,
        userId: this.userData.userId,
        selectedItem: item,
        canApprove: canApprove,
        canCreateNew: this.canCreateNew,
        permission: this.permission    
    });
  }

  loadTasks(site){
    this.displayTask = true;
    this.displayInventroy = false;
    this.displayLabour = false;
    this.selectedSite = site.siteId;
    this.selectedSiteData = site; 
    this.tasks = this.selectedSiteData.taskList;
  } 

  loadInventoryDetail(task){
    this.selectedTask = task.taskId;
    this.displayInventroy = true;
    this.displayLabour = false;
    this.canCreateNew = task.taskStatus != 'Complete';
    this.authservice.siteinventory(this.selectedSiteData.siteId, this.selectedTask).then(
    data => {
        this.siteInventoryData = data;
        this.selectedTaskInventoryData = this.siteInventoryData.data 
        this.inventory = this.selectedTaskInventoryData.inventory;
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });    
  }  
  
  loadLabourDetail(task){
    this.selectedTask = task.taskId;
    this.displayInventroy = false;
    this.displayLabour = true;
    this.canCreateNew = task.taskStatus != 'Complete';
    this.authservice.sitelabour(this.selectedSiteData.siteId, this.selectedTask).then(
    data => {
        this.siteLabourData = data;
        this.selectedTaskLabourData = this.siteLabourData.data 
        this.labour = this.selectedTaskLabourData.labour;
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    }); 
  }

  addlabour(){
    this.navCtrl.push(SiteLabourAddPage, {
        selectedTaskData: this.selectedTaskLabourData,
        userId: this.userData.userId       
    });
  }

  editlabour(labour){
    var canApprove = false;
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedTaskLabourData.siteId){
            canApprove = elem.approve;
        }
    });
    this.navCtrl.push(SiteLabourEditPage, {
        selectedTaskData: this.selectedTaskLabourData,
        userId: this.userData.userId,
        selectedLabour: labour,
        canApprove: canApprove,
        canCreateNew: this.canCreateNew,
        permission: this.permission   
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryPage');
    this.menu.swipeEnable(true, 'menu'); 
  }
}
