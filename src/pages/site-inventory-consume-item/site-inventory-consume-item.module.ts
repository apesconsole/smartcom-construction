import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteInventoryConsumeItemPage } from './site-inventory-consume-item';

@NgModule({
  declarations: [
    SiteInventoryConsumeItemPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteInventoryConsumeItemPage),
  ],
  exports: [
    SiteInventoryConsumeItemPage
  ]
})
export class SiteInventoryConsumeItemPageModule {}
