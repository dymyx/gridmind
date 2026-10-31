import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { CardSelectComponent } from './types/card-select';
import { FormlyInputComponent } from './types/input';
import { FormlySelectComponent } from './types/select';
import { FormFieldWrapperComponent } from './wrappers/FormField';

@NgModule({
  declarations: [
    FormlyInputComponent,
    FormlySelectComponent,
    CardSelectComponent,
    FormFieldWrapperComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  exports: [FormlyModule, ReactiveFormsModule],
})
export class FormlySharedModule {}
