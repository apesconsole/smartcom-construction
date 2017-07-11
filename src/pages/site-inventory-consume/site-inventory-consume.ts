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
  selectedSite: string;
  displayInventroy = false;
  siteInventoryData: any;
  selectedSiteData = {
    siteId: '',
    inventory: []
  };
  inventory = [];
  permission = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, public authservice: AuthService) {
      this.userData = authservice.getDisplayinfo();
      this.selectedSite = '';
      this.loadSiteInfo();
  }

  loadSiteInfo(){
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

  loadDetail(site){
    this.selectedSite = site.siteId;
    this.displayInventroy = true;
    this.authservice.siteinventory(site.siteId).then(
    data => {
        this.siteInventoryData = data;
        this.selectedSiteData = this.siteInventoryData.data 
        this.inventory = this.selectedSiteData.inventory;
    }, error => {
       this.navCtrl.setRoot(LoginPage);
       this.message = error.message;
    });    
  }

  consumeInventory(item){
    this.navCtrl.push(SiteInventoryConsumeItemPage, {
        selectedSiteData: this.selectedSiteData,
        userId: this.userData.userId,
        selectedItem: item   
    });  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryConsumePage');
  }

}
