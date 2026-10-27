import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { SharedModule } from '../../shared/shared-module';
import { FormlySharedModule } from '../../shared/formly/formly-shared.module';
import { AppRoutingModule } from '../../app-routing-module';

@NgModule({
  declarations: [ResultsComponent],
  imports: [CommonModule, SharedModule, FormlySharedModule, AppRoutingModule],
})
export class ResultsModule {}
