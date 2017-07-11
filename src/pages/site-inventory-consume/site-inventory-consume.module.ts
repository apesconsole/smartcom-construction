import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryConsumePage } from './site-inventory-consume';

@NgModule({
  declarations: [
    SiteInventoryConsumePage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryConsumePage),
  ],
  exports: [
    SiteInventoryConsumePage
  ]
})
export class SiteInventoryConsumePageModule {}
