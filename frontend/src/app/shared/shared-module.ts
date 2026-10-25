// shared/shared-module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './ui/header/header.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { FooterComponent } from './ui/footer/footer.component';
import { TableComponent } from './grid/table/table.component';
import { AgGridAngular } from 'ag-grid-angular';
import { UpcomingRaceComponent } from './ui/upcoming-race/upcoming-race.component';
import { LoaderComponent } from './ui/loader/loader.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    TableComponent,
    UpcomingRaceComponent,
    LoaderComponent,
  ],
  imports: [CommonModule, RouterModule, AgGridAngular],
  exports: [
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    TableComponent,
    UpcomingRaceComponent,
    LoaderComponent,
  ],
})
export class SharedModule {}
