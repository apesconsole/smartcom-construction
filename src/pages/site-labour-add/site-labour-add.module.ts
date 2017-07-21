import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteLabourAddPage } from './site-labour-add';

@NgModule({
  declarations: [
    SiteLabourAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteLabourAddPage),
  ],
  exports: [
    SiteLabourAddPage
  ]
})
export class SiteLabourAddPageModule {}
