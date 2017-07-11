import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryPage } from './site-inventory';

@NgModule({
  declarations: [
    SiteInventoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryPage),
  ],
  exports: [
    SiteInventoryPage
  ]
})
export class SiteInventoryPageModule {}
