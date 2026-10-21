import { ConfigOption } from '@ngx-formly/core';
import { FormlyInputComponent } from './types/input';
import { FormFieldWrapperComponent } from './wrappers/FormField';
import { CardSelectComponent } from './types/card-select';
import { maxLengthValidationMessage, minLengthValidationMessage } from './validators/base';

export const FORMLY_CONFIG: ConfigOption = {
  types: [
    { name: 'input', component: FormlyInputComponent, wrappers: ['form-field'] },
    { name: 'card-select', component: CardSelectComponent },
  ],
  wrappers: [{ name: 'form-field', component: FormFieldWrapperComponent }],
  validationMessages: [
    { name: 'required', message: 'This field is required' },
    { name: 'minLength', message: minLengthValidationMessage },
    { name: 'maxLength', message: maxLengthValidationMessage },
  ],
};
