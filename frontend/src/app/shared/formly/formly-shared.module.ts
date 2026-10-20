import { NgModule } from '@angular/core';
import { FormlyInputComponent } from './types/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormFieldWrapperComponent } from './wrappers/FormField';
import { CardSelectComponent } from './types/card-select';

@NgModule({
  declarations: [FormlyInputComponent, CardSelectComponent, FormFieldWrapperComponent],
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  exports: [FormlyModule, ReactiveFormsModule],
})
export class FormlySharedModule {}
