import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule.component';
import { FormlySharedModule } from '../../shared/formly/formly-shared.module';
import { SharedModule } from '../../shared/shared-module';
import { RaceDetailsComponent } from './race-details/race-details.component';

@NgModule({
  declarations: [ScheduleComponent, RaceDetailsComponent],
  imports: [CommonModule, RouterModule, SharedModule, FormlySharedModule],
})
export class ScheduleModule {}
