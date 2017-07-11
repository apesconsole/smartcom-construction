import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryAddPage } from './site-inventory-add';

@NgModule({
  declarations: [
    SiteInventoryAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryAddPage),
  ],
  exports: [
    SiteInventoryAddPage
  ]
})
export class SiteInventoryAddPageModule {}
