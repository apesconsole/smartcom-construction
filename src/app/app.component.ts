import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage }  from '../pages/home/home';

import { SiteInventoryConfigPage } from '../pages/site-inventory-config/site-inventory-config';
import { SiteInventoryPage } from '../pages/site-inventory/site-inventory';
import { SiteInventoryConsumePage } from '../pages/site-inventory-consume/site-inventory-consume';

@Component({
  templateUrl: 'app.html'
})
export class SmartCom {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;

  component:any;

  pages: Array<{type: string, title: string, component: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events: Events) {
    this.initializeApp();
    this.pages = [];
    events.subscribe('loadmenu', pages => {
        this.pages = pages;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  loadPage(){
    this.nav.setRoot(this.component);
  }

  goHome(){
    this.component = HomePage;
    this.loadPage();
  }
  logOut(){
    this.component = LoginPage;
    this.loadPage();
  }
  pageDelegation(p){
    
    if(p.component == 'site-inventory-consume') this.component = SiteInventoryConsumePage;
    else if(p.component == 'site-inventory-config') this.component = SiteInventoryConfigPage;
    else if(p.component == 'site-inventory') this.component = SiteInventoryPage;
    
    this.loadPage();
  }
}
