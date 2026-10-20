import { ConfigOption } from '@ngx-formly/core';
import { FormlyInputComponent } from './types/input';
import { FormFieldWrapperComponent } from './wrappers/FormField';
import { CardSelectComponent } from './types/card-select';

export const FORMLY_CONFIG: ConfigOption = {
  types: [
    { name: 'input', component: FormlyInputComponent, wrappers: ['form-field'] },
    { name: 'card-select', component: CardSelectComponent },
  ],
  wrappers: [{ name: 'form-field', component: FormFieldWrapperComponent }],
};
