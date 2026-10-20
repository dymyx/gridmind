import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-card-select',
  standalone: false,
  styleUrls: ['./card-select.scss'],
  template: `
    <span class="label">
      {{ props.label }}
      <span *ngIf="props.required" class="req">*</span>
    </span>
    <div class="cards" [style.grid-template-columns]="'repeat(' + (props['columns'] || 3) + ', 1fr)'">
      <button
        *ngFor="let opt of $any(props.options)"
        type="button"
        class="card"
        [class.card--selected]="formControl.value === opt.value"
        [attr.aria-pressed]="formControl.value === opt.value"
        (click)="formControl.setValue(opt.value); formControl.markAsTouched()"
      >
        <img *ngIf="opt.image" [src]="opt.image" [alt]="opt.label" />
        <span>{{ opt.label }}</span>
      </button>
    </div>
    <div *ngIf="showError" class="error">Please choose an option</div>
  `,
})
export class CardSelectComponent extends FieldType<FieldTypeConfig> {}
