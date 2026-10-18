import { Component } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-form-field-wrapper',
  standalone: false,
  template: `
    <div class="label-field">
      <label>
        {{ props.label }}
        <span *ngIf="props.required" class="req">*</span>

        <ng-container #fieldComponent></ng-container>

        <div *ngIf="showError" class="error">
          <formly-validation-message [field]="field"></formly-validation-message>
        </div>
      </label>
    </div>
  `,
  styleUrls: ['./FormField.scss'],
})
export class FormFieldWrapperComponent extends FieldWrapper {}
