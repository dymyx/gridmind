// shared/shared-module.ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { PredictDialogComponent } from './dialogs/predict/predict.component';
import { FormlySharedModule } from './formly/formly-shared.module';
import { TableComponent } from './grid/table/table.component';
import { FooterComponent } from './ui/footer/footer.component';
import { HeaderComponent } from './ui/header/header.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { UpcomingRaceComponent } from './ui/upcoming-race/upcoming-race.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    TableComponent,
    UpcomingRaceComponent,
    LoaderComponent,
    PredictDialogComponent,
  ],
  imports: [CommonModule, RouterModule, AgGridAngular, FormlySharedModule],
  exports: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    TableComponent,
    UpcomingRaceComponent,
    LoaderComponent,
    PredictDialogComponent,
  ],
})
export class SharedModule {}
