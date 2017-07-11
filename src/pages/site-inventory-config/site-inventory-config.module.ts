import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryConfigPage } from './site-inventory-config';

@NgModule({
  declarations: [
    SiteInventoryConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryConfigPage),
  ],
  exports: [
    SiteInventoryConfigPage
  ]
})
export class SiteInventoryConfigPageModule {}
