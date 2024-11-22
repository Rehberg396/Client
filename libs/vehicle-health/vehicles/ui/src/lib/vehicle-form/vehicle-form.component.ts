import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Vehicle } from '@cps/types';
import { ButtonComponent, InputComponent, SelectComponent } from '@cps/ui';
import { INTERNAL_LOCK_ENGINE_TYPE } from '@cps/vehicle-health/ui';
import { Observable } from 'rxjs';

import { VhValidators } from '@cps/util';

type VehiclePropertyFormGroup = FormGroup<{
  name: FormControl<string>;
  value: FormControl<string>;
  defaultValue: FormControl<string>;
}>;

export type VehicleFormData = {
  vehicle?: Vehicle;
  options: {
    engineTypes$: Observable<string[]>;
  };
};

@Component({
  selector: 'vh-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatFormFieldModule,
    InputComponent,
    MatIconModule,
    SelectComponent,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
})
export class VehicleFormComponent {
  private readonly dialogRef = inject(MatDialogRef<VehicleFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly data = inject<VehicleFormData>(MAT_DIALOG_DATA);

  vinErrMsg = $localize`Must have 17 upper case characters and not containing 'O', 'I' or 'Q'`;
  patternErrMsg = $localize`Must not contain invalid characters`;
  modelYearErrMsg = $localize`Must be a 4-digit number between 1000 and 2999`;

  get title() {
    if (this.data.vehicle) {
      return $localize`Update Vehicle`;
    } else {
      return $localize`Create Vehicle`;
    }
  }

  get buttonLabel() {
    if (this.data.vehicle) {
      return $localize`Update`;
    } else {
      return $localize`Create`;
    }
  }

  get isUpdate() {
    return Boolean(this.data.vehicle);
  }

  engineTypes$ = this.data.options.engineTypes$;

  readonly form = this.fb.group({
    engineType: this.fb.nonNullable.control(
      this.getProperty('engineType', 'Generic'),
      {
        validators: [Validators.required, Validators.maxLength(255)],
      }
    ),
    vin: this.fb.nonNullable.control(
      { value: this.getProperty('vin'), disabled: this.isUpdate },
      {
        validators: [
          Validators.required,
          Validators.pattern('^[A-HJ-NPR-Z0-9]{17}$'),
        ],
      }
    ),
    manufacturerName: this.fb.nonNullable.control(
      this.getProperty('manufacturerName'),
      {
        validators: [Validators.maxLength(255), VhValidators.specialChars()],
      }
    ),
    modelLine: this.fb.nonNullable.control(this.getProperty('modelLine'), {
      validators: [Validators.maxLength(255), VhValidators.specialChars()],
    }),
    modelType: this.fb.nonNullable.control(this.getProperty('modelType'), {
      validators: [Validators.maxLength(255), VhValidators.specialChars()],
    }),
    modelYear: this.fb.nonNullable.control(this.getProperty('modelYear'), {
      validators: [Validators.pattern('^[12]\\d{3}$')],
    }),
    name: this.fb.nonNullable.control(this.getProperty('name'), {
      validators: [
        Validators.required,
        Validators.maxLength(255),
        VhValidators.specialChars(),
      ],
    }),
    vehicleProperties: this.fb.array<VehiclePropertyFormGroup>(
      this.data.vehicle?.vehicleProperties?.map((property) => {
        const group = new FormGroup({
          name: this.fb.nonNullable.control(property.name ?? '', {
            validators:
              property.name === INTERNAL_LOCK_ENGINE_TYPE
                ? []
                : [
                    Validators.maxLength(255),
                    this.forbiddenNameValidator(INTERNAL_LOCK_ENGINE_TYPE),
                  ],
          }),
          value: this.fb.nonNullable.control(property.value ?? ''),
          defaultValue: this.fb.nonNullable.control(property.defaultValue ?? ''),
        });
        if (property.name === INTERNAL_LOCK_ENGINE_TYPE) {
          group.disable();
        }
        return group;
      }) ?? []
    ),
    licensePlate: this.fb.nonNullable.control(
      this.getProperty('licensePlate'),
      {
        validators: [Validators.maxLength(255), VhValidators.specialChars()],
      }
    ),
  });

  getProperty(property: keyof Vehicle, defaultValue?: string) {
    if (!this.data.vehicle) {
      return defaultValue ?? '';
    }
    return this.data.vehicle[property] ?? defaultValue ?? '';
  }

  @Input()
  isLoading = signal(false);

  @Input()
  handleSubmit?: (vehicle: Vehicle) => void;

  addVehicleProperty(): void {
    this.form.controls['vehicleProperties'].push(
      new FormGroup({
        name: this.fb.nonNullable.control('', {
          validators: [
            Validators.required,
            Validators.maxLength(255),
            this.forbiddenNameValidator(INTERNAL_LOCK_ENGINE_TYPE),
          ],
        }),
        value: this.fb.nonNullable.control(''),
        defaultValue: this.fb.nonNullable.control(''),
      })
    );
  }

  forbiddenNameValidator(key: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = key === control.value;
      return forbidden
        ? { pattern: { requiredPattern: key, actualValue: control.value } }
        : null;
    };
  }

  removeVehicleProperty(index: number): void {
    this.form.controls.vehicleProperties.removeAt(index);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = Object.entries(this.form.controls)
      .filter(([k, v]) => (v.enabled || k === 'vin') && v.value)
      .reduce(
        (acc, [k, v]) => {
          acc[k] = v.value;
          return acc;
        },
        {} as Record<string, unknown>
      ) as unknown as Vehicle;

    const vehicle = {
      ...value,
      vehicleProperties: this.form.controls.vehicleProperties.getRawValue(),
    };
    this.handleSubmit && this.handleSubmit(vehicle);
  }
}
