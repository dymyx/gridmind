// shared/shared-module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './ui/header/header.component';
import { LayoutComponent } from './ui/layout/layout.component';
import { FooterComponent } from './ui/footer/footer.component';
import { TableComponent } from './grid/table/table.component';
import { AgGridAngular } from 'ag-grid-angular';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, LayoutComponent, TableComponent],
  imports: [CommonModule, RouterModule, AgGridAngular],
  exports: [HeaderComponent, FooterComponent, LayoutComponent, TableComponent],
})
export class SharedModule {}
