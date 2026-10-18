import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [ResultsComponent],
  imports: [CommonModule, SharedModule],
})
export class ResultsModule {}
