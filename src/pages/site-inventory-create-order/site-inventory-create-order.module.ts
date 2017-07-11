import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryCreateOrderPage } from './site-inventory-create-order';

@NgModule({
  declarations: [
    SiteInventoryCreateOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryCreateOrderPage),
  ],
  exports: [
    SiteInventoryCreateOrderPage
  ]
})
export class SiteInventoryCreateOrderPageModule {}
