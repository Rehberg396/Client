import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { VehicleDiagnosticSelectionFormComponent } from '../vehicle-diagnostic-selection-form';

import { FleetOverview, QueryParams, RequestStatus, Vehicle } from '@cps/types';
import { NotAvailableComponent, ButtonComponent } from '@cps/ui';

import { DividerComponent, RisksComponent, VehicleItemComponent } from '@cps/vehicle-health/ui';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'vh-vehicle-diagnostic-selection',
  standalone: true,
  templateUrl: './vehicle-diagnostic-selection.component.html',
  styleUrl: './vehicle-diagnostic-selection.component.scss',
  imports: [
    CommonModule,
    NotAvailableComponent,
    ButtonComponent,
    VehicleItemComponent,
    RisksComponent,
    MatIconModule,
    DividerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDiagnosticSelectionComponent implements OnChanges {
  @Input() vehiclesIsLoading = true;
  @Input() vehiclesDataSource: Vehicle[] = [];
  @Input() vehiclesTotalElements = 0;
  @Input() vehiclesQueryParams: QueryParams = {};
  @Input() isDiagnosticRunning = false;

  isLoading$ = new BehaviorSubject<boolean>(this.vehiclesIsLoading);
  dataSource$ = new BehaviorSubject<Vehicle[]>(this.vehiclesDataSource);
  totalElements$ = new BehaviorSubject<number>(this.vehiclesTotalElements);
  queryParams$ = new BehaviorSubject<QueryParams>(this.vehiclesQueryParams);

  @Input() selectedVehicle: RequestStatus<Vehicle> = {
    loadingState: 'initial',
  };
  @Input() selectedFleetOverview: RequestStatus<FleetOverview> = {
    loadingState: 'initial',
  };

  @Output() eventVehicleSelected = new EventEmitter<string>();
  @Output() eventLoadVehicles = new EventEmitter();

  private readonly dialog = inject(MatDialog);

  ngOnChanges(): void {
    this.updateData();
  }

  onSelect(): void {
    this.openDialog();
    this.eventLoadVehicles.emit();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(
      VehicleDiagnosticSelectionFormComponent,
      {
        width: '60%',
        disableClose: true,
        data: {
          isLoading$: this.isLoading$.asObservable(),
          dataSource$: this.dataSource$.asObservable(),
          totalElements$: this.totalElements$.asObservable(),
          queryParams$: this.queryParams$.asObservable(),
        },
      },
    );

    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.handleSubmit = (selectedVin) => {
      this.eventVehicleSelected.emit(selectedVin);
      dialogRef.close();
    };
  }

  updateData(): void {
    this.isLoading$.next(this.vehiclesIsLoading);
    this.dataSource$.next(this.vehiclesDataSource);
    this.totalElements$.next(this.vehiclesTotalElements);
    this.queryParams$.next(this.vehiclesQueryParams);
  }
}
