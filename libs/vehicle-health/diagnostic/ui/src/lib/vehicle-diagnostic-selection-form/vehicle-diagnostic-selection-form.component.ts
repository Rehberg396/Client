import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  Input,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent, SearchInputComponent } from '@cps/ui';
import { VehicleDiagnosticSelectionTableComponent } from '../vehicle-diagnostic-selection-table';
import { QueryParams, Vehicle } from '@cps/types';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'vh-vehicle-diagnostic-selection-form',
  templateUrl: './vehicle-diagnostic-selection-form.component.html',
  styleUrl: './vehicle-diagnostic-selection-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ButtonComponent,
    ReactiveFormsModule,
    SearchInputComponent,
    VehicleDiagnosticSelectionTableComponent,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDiagnosticSelectionFormComponent {
  private readonly dialogRef = inject(
    MatDialogRef<VehicleDiagnosticSelectionFormComponent>,
  );
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  @Input() handleSubmit?: (vin: string) => void;

  isLoading$: Observable<boolean>;
  dataSource$: Observable<Vehicle[]>;
  totalElements$: Observable<number>;
  queryParams$: Observable<QueryParams>;

  form = this.fb.group({
    selectedElement: [''],
  });
  size = 5;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isLoading$: Observable<boolean>;
      dataSource$: Observable<Vehicle[]>;
      totalElements$: Observable<number>;
      queryParams$: Observable<QueryParams>;
    },
  ) {
    this.isLoading$ = data.isLoading$;
    this.dataSource$ = data.dataSource$;
    this.totalElements$ = data.totalElements$;
    this.queryParams$ = data.queryParams$;
  }

  onClose(): void {
    this.router.navigate([], {
      queryParams: {
        page: null,
        size: null,
        search: null,
      },
      queryParamsHandling: 'merge',
    });
    this.dialogRef.close();
  }

  onSubmit(): void {
    const selectedVin = this.getSelected();
    this.handleSubmit?.(selectedVin);
  }

  onSearch(search: string) {
    this.router.navigate([], {
      queryParams: {
        page: 0,
        size: this.size,
        search: search,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(value: PageEvent) {
    this.router.navigate([], {
      queryParams: {
        page: value.pageIndex,
        size: value.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  isSelected(): boolean {
    return !!this.form.get('selectedElement')?.value;
  }

  setSelected(selectedElement: string) {
    this.form.get('selectedElement')?.setValue(selectedElement);
  }

  getSelected(): string {
    return this.form.get('selectedElement')?.value || '';
  }
}
