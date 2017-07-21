import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteLabourAddBillingPage } from './site-labour-add-billing';

@NgModule({
  declarations: [
    SiteLabourAddBillingPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteLabourAddBillingPage),
  ],
  exports: [
    SiteLabourAddBillingPage
  ]
})
export class SiteLabourAddBillingPageModule {}
