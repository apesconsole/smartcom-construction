import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events} from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-site-inventory-add',
  templateUrl: 'site-inventory-add.html',
})
export class SiteInventoryAddPage {
 
  userId: string;
  message: string;
  selectedSite: string;
  selectedTask: string;
  selectedTaskData = {
    siteId: '',
    taskId: '',
    inventory: []
  };
  serverData: any;
  configData = [];
  selectedItem = {
  	item: '',
  	quantity: 0,
  	uom:''
  }

  notificationData = {
    key: '',
    subject: '',
    message: ''
  }

  displayText = {
    siteName: '',
    taskDescription: ''
  }
  
  isLocked = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authservice: AuthService, public alertCtrl: AlertController, public events: Events){
      this.userId = this.navParams.get('userId');
	    this.selectedTaskData = this.navParams.get('selectedTaskData');
      this.displayText = this.navParams.get('displayText');
	    this.selectedSite = this.selectedTaskData.siteId;
      this.selectedTask = this.selectedTaskData.taskId;
	    this.loadInventoryConfig();
  }

  scanExistingInventory(_c){
    let found = false
    this.selectedTaskData.inventory
      .map((_i)=>{
        if(_i.item == _c.item && !found) found = true;
        return _i;
      });
    return found;
  }

  loadInventoryConfig(){
    this.authservice.getinventoryconfig().then(
    data => {
    	  this.serverData = data;
        this.configData = this.serverData.data.items
        .filter((_c)=>{
            return !this.scanExistingInventory(_c);
        });
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });
  }

  selectconfig(config){
	   this.selectedItem.item = config.item;
	   this.selectedItem.uom = config.uom;
  }

  saveField(){
      if(!this.isLocked){
          this.isLocked = true;
          let newInventory = {
              "item": this.selectedItem.item,
              "quantity": this.selectedItem.quantity,
              "orders":[],
              "requests":[],
              "consumption":[],
              "uom": this.selectedItem.uom,
              "totalPrice": 0,
              "totalPayment": 0, 
              "createDate": new Date(),
              "createdBy": this.userId,
              "approved": false,
              "approvedBy": '',
              "approvalDate": '',
              "releasedBy": '',
              "releaseDate":''
          };

          this.authservice.addinventory(newInventory, this.selectedSite, this.selectedTask, this.notificationData).then(
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
                this.events.publish('refreshSiteData', this.selectedSite);
                this.events.publish('refreshInventoryData', {
                    siteId: this.selectedSite, 
                    taskId: this.selectedTask
                });
                this.navCtrl.pop();
            }, error => {
               this.navCtrl.setRoot(LoginPage);
               this.message = error.message;
          });  
      }   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryAddPage');
  }

}
