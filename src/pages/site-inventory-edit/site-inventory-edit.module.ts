import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryEditPage } from './site-inventory-edit';

@NgModule({
  declarations: [
    SiteInventoryEditPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryEditPage),
  ],
  exports: [
    SiteInventoryEditPage
  ]
})
export class SiteInventoryEditPageModule {}
