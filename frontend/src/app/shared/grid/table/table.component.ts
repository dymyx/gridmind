import { Component, Input } from '@angular/core';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() rowData: any[] = [];
  @Input() columns: ColDef[] = [];
  @Input() viewNumber: boolean = false;
  public defaultColDef = { sortable: true, filter: true, resizable: true, flex: 1 };

  get columnDefs(): ColDef[] {
    return [
      {
        field: 'number',
        headerName: '№',
        flex: 0,
        width: 70,
      },
      ...this.columns,
    ];
  }
}
