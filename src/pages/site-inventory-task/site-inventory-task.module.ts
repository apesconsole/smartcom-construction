import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryTaskPage } from './site-inventory-task';

@NgModule({
  declarations: [
    SiteInventoryTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryTaskPage),
  ],
  exports: [
    SiteInventoryTaskPage
  ]
})
export class SiteInventoryTaskPageModule {}
