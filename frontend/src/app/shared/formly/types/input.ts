import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-input',
  standalone: false,
  template: `
    <input
      class="input"
      [type]="props.type || 'text'"
      [formControl]="formControl"
      [formlyAttributes]="field"
    />
  `,
  styleUrls: ['./input.scss'],
})
export class FormlyInputComponent extends FieldType<FieldTypeConfig> {}
