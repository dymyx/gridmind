import { Component } from '@angular/core'
import { FieldType, FieldTypeConfig } from '@ngx-formly/core'

@Component({
  selector: 'app-formly-select',
  standalone: false,
  template: `
    <select class="input select" [formControl]="formControl" [formlyAttributes]="field">
      <option [ngValue]="null" disabled>Choose driver</option>
      <option *ngFor="let opt of $any(props.options)" [ngValue]="opt.value">
        {{ opt.label }}
      </option>
    </select>
  `,
  styleUrls: ['./input.scss', './select.scss'],
})
export class FormlySelectComponent extends FieldType<FieldTypeConfig> {}
