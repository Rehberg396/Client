import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Input,
} from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonLoadingComponent, ButtonComponent } from '@cps/ui';
import { DividerComponent, VehicleImageComponent } from '@cps/vehicle-health/ui';
import { VehicleDiagnosticSelectionComponent, VehicleDiagnosticTableComponent } from '@cps/vehicle-health/diagnostic/ui';
import { toPageNumber, toStringParam, unwrapData, unwrapPaging } from '@cps/util';
import { DiagnosticStore } from '@cps/vehicle-health/diagnostic/data-access';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, map, tap } from 'rxjs';
import { DiagnosticStep, QueryParams } from '@cps/types';
import { provideComponentStore } from '@ngrx/component-store';
import { VehicleStore } from '@cps/vehicle-health/vehicles/data-access';
import { VehicleDetailStore } from '@cps/vehicle-health/vehicle-details/data-access';
import { Router } from '@angular/router';

@Component({
  selector: 'vh-vehicle-diagnostic',
  standalone: true,
  templateUrl: './vehicle-diagnostic.component.html',
  styleUrl: './vehicle-diagnostic.component.scss',
  imports: [
    CommonModule,
    AsyncPipe,
    VehicleDiagnosticSelectionComponent,
    VehicleImageComponent,
    SkeletonLoadingComponent,
    ButtonComponent,
    MatIconModule,
    VehicleDiagnosticTableComponent,
    DividerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideComponentStore(VehicleStore),
    provideComponentStore(VehicleDetailStore),
    provideComponentStore(DiagnosticStore),
  ],
})
export class VehicleDiagnosticComponent {
  private readonly diagnosticStore = inject(DiagnosticStore);
  private readonly vehicleStore = inject(VehicleStore);
  private readonly vehicleDetailStore = inject(VehicleDetailStore);
  private readonly router = inject(Router);

  page = input(0, { transform: toPageNumber });
  size = input(5);
  search = input('', { transform: toStringParam });
  queryState = computed(() => ({
    page: this.page(),
    size: this.size(),
    search: this.search(),
  }));

  queryParams$ = toObservable(this.queryState).pipe(
    map((state) => {
      const queryParams: QueryParams = {};
      if (state.size) {
        queryParams['page'] = state.page;
      }
      if (state.size) {
        queryParams['size'] = state.size;
      }
      if (state.search) {
        queryParams['search'] = state.search;
      }
      return queryParams;
    }),
    tap((queryParams) => {
      this.vehicleStore.searchVehicles(queryParams);
    }),
  );
  pagingVehicles = unwrapPaging(this.vehicleStore.selectors.vehicles$);

  vin = input<string>();
  vinState = computed(() => ({
    vin: this.vin(),
  }));
  vinParam$ = toObservable(this.vinState).pipe(
    map((state) => state.vin ?? ''),
    tap((vin) => {
      if (vin != '') {
        this.vehicleDetailStore.loadVehicle(vin);
        this.vehicleDetailStore.loadOneFleetOverview(vin);
        this.diagnosticStore.loadDiagnosticSteps(vin);
      }
    })
  );
  vehicle$ = this.vehicleDetailStore.selectors.vehicle$;
  fleetOverview$ = this.vehicleDetailStore.selectors.fleetOverview$;

  diagnosticSteps$ = this.diagnosticStore.selectors.diagnosticsSteps$;

  vm$ = combineLatest([
    this.pagingVehicles.isLoading$,
    this.pagingVehicles.dataSource$,
    this.pagingVehicles.errorMessage$,
    this.pagingVehicles.totalElements$,
    this.queryParams$,
    this.vehicle$,
    this.fleetOverview$,
    this.diagnosticSteps$,
    this.vinParam$,
  ]).pipe(
    map(
      ([
        vehiclesIsLoading,
        vehiclesDataSource,
        vehiclesErrorMessage,
        vehiclesTotalElements,
        vehiclesQueryParams,
        selectedVehicle,
        selectedFleetOverview,
        diagnosticSteps,
      ]) => ({
        vehiclesIsLoading,
        vehiclesDataSource,
        vehiclesErrorMessage,
        vehiclesTotalElements,
        vehiclesQueryParams,
        selectedVehicle,
        selectedFleetOverview,
        diagnosticSteps,
      }),
    ),
  );

  onStartDiagnosis(): void {
    this.diagnosticStore.startDiagnostic(this.vin());
  }

  onResetSteps() {
    console.log('reset');
  }

  onVehicleSelected(selectedVehicle: string): void {
    this.router.navigate([], {
      queryParams: {
        page: null,
        size: null,
        search: null,
        vin: selectedVehicle,
      },
      queryParamsHandling: 'merge',
    });
  }

  onLoadVehicles(): void {
    this.router.navigate([], {
      queryParams: {
        page: 0,
        size: 5,
        search: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
