import { ConfigOption } from '@ngx-formly/core';
import { CardSelectComponent } from './types/card-select';
import { FormlyInputComponent } from './types/input';
import { FormlySelectComponent } from './types/select';
import { maxLengthValidationMessage, minLengthValidationMessage } from './validators/base';
import { FormFieldWrapperComponent } from './wrappers/FormField';

export const FORMLY_CONFIG: ConfigOption = {
  types: [
    { name: 'input', component: FormlyInputComponent, wrappers: ['form-field'] },
    { name: 'select', component: FormlySelectComponent, wrappers: ['form-field'] },
    { name: 'card-select', component: CardSelectComponent },
  ],
  wrappers: [{ name: 'form-field', component: FormFieldWrapperComponent }],
  validationMessages: [
    { name: 'required', message: 'This field is required' },
    { name: 'minLength', message: minLengthValidationMessage },
    { name: 'maxLength', message: maxLengthValidationMessage },
  ],
};
