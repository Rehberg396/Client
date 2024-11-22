import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent, InputComponent, SelectComponent } from '@cps/ui';
import { Observable } from 'rxjs';

export type EngineTypeRequest = Pick<EngineType, 'engineType'> & {
  engineType: string;
};

export interface EngineType {
  engineType: string;
}
@Component({
  selector: 'vh-update-engine-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    MatFormFieldModule,
    MatSelectModule,
    AsyncPipe,
    InputComponent,
    MatIconModule,
    SelectComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-engine-type-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEngineTypeFormComponent {
  private readonly dialogRef = inject(
    MatDialogRef<UpdateEngineTypeFormComponent>
  );

  private readonly data: {
    options: {
      engineTypes$: Observable<string[]>;
    };
  } = inject(MAT_DIALOG_DATA);

  engineTypes$ = this.data.options.engineTypes$;

  @Input()
  isLoading = signal(false);

  @Input()
  handleSubmit?: (request: EngineTypeRequest) => void;

  updateButtonLabel = $localize`Update Engine Type`;
  cancelLabel = $localize`Cancel`;

  readonly engineTypeForm = new FormGroup({
    engineType: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  submit(): void {
    if (this.engineTypeForm.invalid) {
      return;
    }
    const data = this.engineTypeForm.getRawValue();
    this.handleSubmit && this.handleSubmit(data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
