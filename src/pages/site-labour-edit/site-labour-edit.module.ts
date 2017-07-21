import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteLabourEditPage } from './site-labour-edit';

@NgModule({
  declarations: [
    SiteLabourEditPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteLabourEditPage),
  ],
  exports: [
    SiteLabourEditPage
  ]
})
export class SiteLabourEditPageModule {}
