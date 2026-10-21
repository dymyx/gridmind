import { FormlyFieldConfig } from '@ngx-formly/core';

export function minLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `The field must contain at least ${field.props?.minLength} characters`;
}

export function maxLengthValidationMessage(error: any, field: FormlyFieldConfig) {
  return `This field must be at most ${field.props?.maxLength} characters`;
}
