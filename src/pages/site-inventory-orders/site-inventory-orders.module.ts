import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryOrdersPage } from './site-inventory-orders';

@NgModule({
  declarations: [
    SiteInventoryOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryOrdersPage),
  ],
  exports: [
    SiteInventoryOrdersPage
  ]
})
export class SiteInventoryOrdersPageModule {}
