import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog'
import { Component, Inject } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFieldConfig } from '@ngx-formly/core'
import { IDriver } from '../../types/api.types'

const POSITIONS = 3;

@Component({
  selector: 'app-predict-dialog',
  standalone: false,
  template: `
    <div class="dialog">
      <h3>Make prediction</h3>
      <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
      <div class="btns">
        <button class="btn btn--ghost" (click)="dialogRef.close()">Cancel</button>
        <button class="btn btn--primary" [disabled]="form.invalid" (click)="save()">Save</button>
      </div>
    </div>
  `,
  styles: `.dialog { background: #fff; padding: 24px; border-radius: 8px; min-width: 460px;} .btns {display: flex; gap: 10px; justify-content: flex-end;}`,
})
export class PredictDialogComponent {
  public form = new FormGroup({});
  public model: Record<string, string> = {};
  public fields: FormlyFieldConfig[];

  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: { raceId: string; drivers: IDriver[] },
  ) {
    this.fields = Array.from({ length: POSITIONS }, (_, i) => ({
      key: `p${i + 1}`,
      type: 'select',
      props: { label: `Position #${i + 1}`, required: true, options: [] },
    }));

    this.updateOptions();
    this.form.valueChanges.subscribe(() => this.updateOptions());
  }

  private updateOptions() {
    const selected = this.form.value as Record<string, string | null>;

    this.fields.forEach((field) => {
      const taken = Object.entries(selected)
        .filter(([key, id]) => key !== field.key && id)
        .map(([, id]) => id);

      field.props!.options = this.data.drivers
        .filter((d) => !taken.includes(d.id))
        .map((d) => ({ value: d.id, label: `${d.first_name} ${d.last_name}` }));
    });
  }

  public save() {
    const results = Array.from({ length: POSITIONS }, (_, i) => ({
      driverId: this.model[`p${i + 1}`],
      pos: i + 1,
    }));

    this.dialogRef.close({ race_id: this.data.raceId, predicts: results });
  }
}
