import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteCreateTaskPage } from './site-create-task';

@NgModule({
  declarations: [
    SiteCreateTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteCreateTaskPage),
  ],
  exports: [
    SiteCreateTaskPage
  ]
})
export class SiteCreateTaskPageModule {}
