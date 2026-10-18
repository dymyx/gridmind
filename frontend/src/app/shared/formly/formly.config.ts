import { ConfigOption } from '@ngx-formly/core';
import { FormlyInputComponent } from './types/input';
import { FormFieldWrapperComponent } from './wrappers/FormField';

export const FORMLY_CONFIG: ConfigOption = {
  types: [{ name: 'input', component: FormlyInputComponent, wrappers: ['form-field'] }],
  wrappers: [{ name: 'form-field', component: FormFieldWrapperComponent }],
};
