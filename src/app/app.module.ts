import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AuthService } from '../pages/login/authservice';

import { SmartCom }  from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage }  from '../pages/home/home';
import { SiteInventoryConfigPage } from '../pages/site-inventory-config/site-inventory-config';
import { SiteInventoryPage } from '../pages/site-inventory/site-inventory';
import { SiteCreateTaskPage } from '../pages/site-create-task/site-create-task';
import { SiteEditTaskPage } from '../pages/site-edit-task/site-edit-task';
import { SiteInventoryAddPage } from '../pages/site-inventory-add/site-inventory-add';
import { SiteInventoryEditPage } from '../pages/site-inventory-edit/site-inventory-edit';
import { SiteInventoryOrdersPage } from '../pages/site-inventory-orders/site-inventory-orders';
import { SiteInventoryCreateOrderPage } from '../pages/site-inventory-create-order/site-inventory-create-order';
import { SiteInventoryConsumePage } from '../pages/site-inventory-consume/site-inventory-consume';
import { SiteInventoryConsumeItemPage } from '../pages/site-inventory-consume-item/site-inventory-consume-item';

@NgModule({
  declarations: [
    SmartCom,
    LoginPage,
    HomePage,
    SiteInventoryConfigPage,
    SiteInventoryPage,
    SiteCreateTaskPage,
    SiteEditTaskPage,
    SiteInventoryAddPage,
    SiteInventoryEditPage,
    SiteInventoryOrdersPage,
    SiteInventoryCreateOrderPage,
    SiteInventoryConsumePage,
    SiteInventoryConsumeItemPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(SmartCom),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SmartCom,
    LoginPage,
    HomePage,
    SiteInventoryConfigPage,
    SiteInventoryPage,
    SiteCreateTaskPage,
    SiteEditTaskPage,
    SiteInventoryAddPage,
    SiteInventoryEditPage,
    SiteInventoryOrdersPage,
    SiteInventoryCreateOrderPage,
    SiteInventoryConsumePage,
    SiteInventoryConsumeItemPage
  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
