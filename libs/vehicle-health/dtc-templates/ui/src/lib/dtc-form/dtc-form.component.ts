import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DtcTemplate } from '@cps/types';
import { ButtonComponent, InputComponent, SelectComponent } from '@cps/ui';

export interface DtcFormInputData {
  dtcItem?: DtcTemplate;
  options: {
    risks: string[];
    criticalities: string[];
    engineTypes: string[];
  };
}

@Component({
  selector: 'vh-dtc-form',
  standalone: true,
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatFormFieldModule,
    InputComponent,
    SelectComponent,
    AsyncPipe,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './dtc-form.component.html',
  styleUrls: ['./dtc-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtcFormComponent {
  private readonly dialogRef = inject(MatDialogRef<DtcFormComponent>);
  readonly data = inject<DtcFormInputData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  get title() {
    if (this.data.dtcItem) {
      return $localize`Update DTC`;
    } else {
      return $localize`Create DTC`;
    }
  }

  get buttonLabel() {
    if (this.data.dtcItem) {
      return $localize`Update`;
    } else {
      return $localize`Create`;
    }
  }

  get isUpdate() {
    return Boolean(this.data.dtcItem);
  }

  readonly form = this.fb.group({
    source: this.fb.nonNullable.control(
      { value: this.getProperty('source'), disabled: this.isUpdate },
      { validators: [Validators.required] }
    ),
    protocolStandard: this.fb.nonNullable.control(
      {
        value: this.getProperty('protocolStandard'),
        disabled: this.isUpdate,
      },
      { validators: [Validators.required] }
    ),
    dtcCode: this.fb.nonNullable.control(
      {
        value: this.getProperty('dtcCode'),
        disabled: this.isUpdate,
      },
      { validators: [Validators.required] }
    ),
    oem: this.fb.nonNullable.control(
      { value: this.getProperty('oem'), disabled: this.isUpdate },
      { validators: [Validators.required] }
    ),
    engineType: this.fb.nonNullable.control(
      {
        value: this.getProperty('engineType', 'Generic'),
        disabled: this.isUpdate,
      },
      {
        validators: [Validators.required],
      }
    ),
    description: this.fb.nonNullable.control(this.getProperty('description')),
    comment: this.fb.nonNullable.control(this.getProperty('comment')),
    category: this.fb.nonNullable.control(this.getProperty('category')),
    group: this.fb.nonNullable.control(this.getProperty('group')),
    possibleCause: this.fb.nonNullable.control(
      this.getProperty('possibleCause')
    ),
    criticality: this.fb.nonNullable.control(this.getProperty('criticality')),
    symptom: this.fb.nonNullable.control(this.getProperty('symptom')),
    riskSafety: this.fb.nonNullable.control(this.getProperty('riskSafety')),
    riskDamage: this.fb.nonNullable.control(this.getProperty('riskDamage')),
    riskAvailability: this.fb.nonNullable.control(
      this.getProperty('riskAvailability')
    ),
    riskEmissions: this.fb.nonNullable.control(
      this.getProperty('riskEmissions')
    ),
    recommendations: this.fb.array(
      this.data.dtcItem?.recommendations?.map((recommendation) =>
        this.fb.nonNullable.control(recommendation, {
          validators: [Validators.required],
        })
      ) ?? []
    ),
  });

  @Input()
  isLoading = signal(false);

  @Input()
  handleSubmit?: (dtc: DtcTemplate) => void;

  getProperty(
    property: keyof Omit<DtcTemplate, 'recommendations'>,
    defaultValue?: string
  ) {
    if (!this.data.dtcItem) {
      return defaultValue ?? '';
    }
    return this.data.dtcItem[property] ?? defaultValue ?? '';
  }

  onAddRecommendation(): void {
    this.form.controls.recommendations.push(
      this.fb.nonNullable.control('', {
        validators: [Validators.required],
      })
    );
  }

  onRemoveRecommendation(index: number): void {
    this.form.controls.recommendations.removeAt(index);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue() as DtcTemplate;
    this.handleSubmit && this.handleSubmit(value);
  }
}
