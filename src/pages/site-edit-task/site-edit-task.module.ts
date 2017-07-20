import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteEditTaskPage } from './site-edit-task';

@NgModule({
  declarations: [
    SiteEditTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteEditTaskPage),
  ],
  exports: [
    SiteEditTaskPage
  ]
})
export class SiteEditTaskPageModule {}
