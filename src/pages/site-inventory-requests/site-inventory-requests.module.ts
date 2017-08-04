import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryRequestsPage } from './site-inventory-requests';

@NgModule({
  declarations: [
    SiteInventoryRequestsPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryRequestsPage),
  ],
  exports: [
    SiteInventoryRequestsPage
  ]
})
export class SiteInventoryRequestsPageModule {}
