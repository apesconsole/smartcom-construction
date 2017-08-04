import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, Events } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';
import { SiteInventoryAddPage } from '../site-inventory-add/site-inventory-add';
import { SiteInventoryEditPage } from '../site-inventory-edit/site-inventory-edit';
import { SiteLabourAddPage } from '../site-labour-add/site-labour-add';
import { SiteLabourEditPage } from '../site-labour-edit/site-labour-edit';

@IonicPage()
@Component({
  selector: 'page-site-inventory-task',
  templateUrl: 'site-inventory-task.html',
})
export class SiteInventoryTaskPage {
  message: string ;
  siteInventoryData: any;
  siteLabourData: any;
  userData: any;
  selectedTaskInventoryData = {
    siteId: '',
    taskId: '',
    inventory: []
  };
  selectedSite: string;
  selectedTask: string;
  selectedTaskLabourData = {
    siteId: '',
    taskId: '',
    labour: []
  };  
  inventory = [];
  labour = [];
  permission = [];

  displayInventroy = true;
  displayLabour = false;
  selectedSiteData = {
    siteId:'',
    siteName: '',
    taskList: [] 
  }
  selectedTaskData = {
  	taskId: '',
  	taskDescription: '', 
    currency: 'INR',
    estimatedCost: 0,
    actualCost: 0,
    totalPayment: 0,
    totalLabour: 0,
    totalInventory: 0,
  	estimatedDays: 0, 
  	daysRemaining: 0, 
  	taskStatus: 'Waiting',
  	createDate: new Date(),
  	createdBy: '',
  	updateDate: Date,
  	updatedBy: '' 	
  };

  taskDataText = '';
  
  displayText = {
    siteName: '',
    taskDescription: ''
  }
  currency = '';
  canCreateNew = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService, public events: Events) {
      //These 2 Lines - Total Savior!!
      this.events.unsubscribe('refreshInventoryData');
      this.events.unsubscribe('refreshLabourData'); 
      // End
      this.userData = authservice.getDisplayinfo();
    	this.displayInventroy = this.navParams.get('displayInventroy'); 
    	this.displayLabour = this.navParams.get('displayLabour'); 
    	this.selectedSiteData = this.navParams.get('selectedSiteData');
    	this.selectedTaskData = this.navParams.get('selectedTaskData');
      this.permission = this.navParams.get('permission');

      this.displayText.siteName = this.selectedSiteData.siteName;
      this.displayText.taskDescription = this.selectedTaskData.taskDescription;
      this.currency = this.selectedTaskData.currency;
      this.selectedSite = this.selectedSiteData.siteId;
      this.selectedTask = this.selectedTaskData.taskId;
      this.canCreateNew = this.selectedTaskData.taskStatus != 'Complete'; 


      if(this.displayInventroy){
        this.taskDataText = 'Inventory';
        this.loadInventoryDetail();
      } else{
        this.taskDataText = 'Labour';
        this.loadLabourDetail();
      }

      //Async Refresh Inventory
      this.events.subscribe('refreshInventoryData', (_default) => {
          this.taskDataText = 'Inventory';
          this.selectedSite = _default.siteId;
          this.selectedTask = _default.taskId;
          this.displayInventroy = true;
          this.displayLabour = false;
          this.loadInventoryDetail();
      });

      //Async Refresh Labour
      this.events.subscribe('refreshLabourData', (_default) => {
          this.taskDataText = 'Labour';
          this.selectedSite = _default.siteId;
          this.selectedTask = _default.taskId;
          this.displayInventroy = false;
          this.displayLabour = true;
          this.loadLabourDetail();
      });
  }

  loadInventoryDetail(){
    this.authservice.siteinventory(this.selectedSiteData.siteId, this.selectedTask).then(
    data => {
        this.siteInventoryData = data;
        this.selectedTaskInventoryData = this.siteInventoryData.data; 
        this.inventory = this.selectedTaskInventoryData.inventory;
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });    
  }  
  
  loadLabourDetail(){
    this.authservice.sitelabour(this.selectedSiteData.siteId, this.selectedTask).then(
    data => {
        this.siteLabourData = data;
        this.selectedTaskLabourData = this.siteLabourData.data;
        this.labour = this.selectedTaskLabourData.labour;
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

  addinventory(){
    this.navCtrl.push(SiteInventoryAddPage, {
        selectedTaskData: this.selectedTaskInventoryData,
        userId: this.userData.userId,
        displayText: this.displayText       
    });
  }

  addlabour(){
    this.navCtrl.push(SiteLabourAddPage, {
        selectedTaskData: this.selectedTaskLabourData,
        userId: this.userData.userId,
        displayText: this.displayText       
    });
  }


  editinventory(item){
    var canApprove = false;
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
        permission: this.permission,
        displayText: this.displayText    
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
        permission: this.permission,
        displayText: this.displayText   
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryTaskPage');    
  }

}
