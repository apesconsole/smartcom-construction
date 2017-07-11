import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams } from 'ionic-angular';

import { AuthService } from '../login/authservice';
import { LoginPage } from '../login/login';
import { SiteInventoryAddPage } from '../site-inventory-add/site-inventory-add';
import { SiteInventoryEditPage } from '../site-inventory-edit/site-inventory-edit';

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

  addinventory(){
    this.navCtrl.push(SiteInventoryAddPage, {
        selectedSiteData: this.selectedSiteData,
        userId: this.userData.userId       
    });
  }

  editinventory(item){
    var canApprove = false;
    console.log(this.permission);
    this.permission.map((elem) => {
        if(elem.siteId == this.selectedSiteData.siteId){
            canApprove = elem.approve;
        }
    });
    this.navCtrl.push(SiteInventoryEditPage, {
        selectedSiteData: this.selectedSiteData,
        userId: this.userData.userId,
        selectedItem: item,
        canApprove: canApprove     
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
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteInventoryPage');
    this.menu.swipeEnable(true, 'menu'); 
  }
}
