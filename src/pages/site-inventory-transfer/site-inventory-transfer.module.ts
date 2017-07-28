import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryTransferPage } from './site-inventory-transfer';

@NgModule({
  declarations: [
    SiteInventoryTransferPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryTransferPage),
  ],
  exports: [
    SiteInventoryTransferPage
  ]
})
export class SiteInventoryTransferPageModule {}
