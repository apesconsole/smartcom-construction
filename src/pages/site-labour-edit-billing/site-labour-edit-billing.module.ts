import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteLabourEditBillingPage } from './site-labour-edit-billing';

@NgModule({
  declarations: [
    SiteLabourEditBillingPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteLabourEditBillingPage),
  ],
  exports: [
    SiteLabourEditBillingPage
  ]
})
export class SiteLabourEditBillingPageModule {}
