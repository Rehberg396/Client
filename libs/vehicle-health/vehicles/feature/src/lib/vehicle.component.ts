import { SelectionModel } from '@angular/cdk/collections';
import { AsyncPipe } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import {
  FaultDismissInfo,
  QueryParams,
  RichVehicleFault,
  Vehicle,
} from '@cps/types';
import {
  ButtonComponent,
  ColumnConfig,
  ColumnConfigComponent,
  ConfirmDialogComponent,
  ErrorDialogComponent,
  SearchInputComponent,
  TableComponent,
} from '@cps/ui';
import {
  deserializeDisplayedColumns,
  serializeDisplayedColumns,
  toPageNumber,
  toPageSize,
  toSortDirection,
  toSortParam,
  toStringParam,
  unwrapPaging,
} from '@cps/util';
import {
  EngineTypeComponent,
  INTERNAL_LOCK_ENGINE_TYPE,
  UPDATE_ENGINE_TYPE_MANUALLY,
} from '@cps/vehicle-health/ui';
import { VehicleFaultStore } from '@cps/vehicle-health/vehicle-faults/data-access';
import {
  ProcessingStageDialogComponent,
  VehicleFaultsComponent,
} from '@cps/vehicle-health/vehicle-faults/ui';
import { VehicleStore } from '@cps/vehicle-health/vehicles/data-access';
import {
  DeletionReportComponent,
  EngineTypeRequest,
  UpdateEngineTypeFormComponent,
  VehicleFormComponent,
  VehiclePropertiesComponent,
} from '@cps/vehicle-health/vehicles/ui';
import { provideComponentStore } from '@ngrx/component-store';
import {
  AngularSplitModule,
  IOutputAreaSizes,
  IOutputData,
} from 'angular-split';
import { combineLatest, filter, map, tap } from 'rxjs';

@Component({
  selector: 'vh-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonComponent,
    MatIconModule,
    MatTabsModule,
    AngularSplitModule,
    SearchInputComponent,
    ColumnConfigComponent,
    TableComponent,
    AsyncPipe,
    MatPaginatorModule,
    VehiclePropertiesComponent,
    EngineTypeComponent,
    MatCheckboxModule,
    MatTooltipModule,
    RouterModule,
    VehicleFaultsComponent,
  ],
  providers: [
    provideComponentStore(VehicleStore),
    provideComponentStore(VehicleFaultStore),
  ],
})
export class VehicleComponent {
  @ViewChild('engineType', { static: true })
  engineType!: TemplateRef<unknown>;

  private readonly store = inject(VehicleStore);
  private readonly vehicleFaultStore = inject(VehicleFaultStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  selection = new SelectionModel<Vehicle>(true, []);

  page = input(0, { transform: toPageNumber });
  size = input(0, { transform: toPageSize });
  search = input('', { transform: toStringParam });
  needManualUpdatedEngineType = input(false, { transform: booleanAttribute });

  displayedColumns = input(
    { isHidden: () => false },
    { transform: (value: unknown) => deserializeDisplayedColumns(value) }
  );

  count = signal(0);
  private refresh() {
    this.count.update((state) => state + 1);
  }

  queryState = computed(() => ({
    page: this.page(),
    size: this.size(),
    search: this.search(),
    needManualUpdatedEngineType: this.needManualUpdatedEngineType(),
    count: this.count(),
  }));

  queryParams$ = toObservable(this.queryState).pipe(
    map((state) => {
      const queryParams: QueryParams = {};
      queryParams['page'] = state.page;
      queryParams['size'] = state.size;
      if (state.needManualUpdatedEngineType) {
        queryParams['needManualUpdatedEngineType'] =
          state.needManualUpdatedEngineType;
      }
      if (state.search) {
        queryParams['search'] = state.search;
      }
      return queryParams;
    }),
    tap((queryParams) => {
      this.selection.clear();
      this.store.searchVehicles(queryParams);
    })
  );

  columnConfigs = computed<ColumnConfig<Vehicle>[]>(() => {
    const displayedColumns = this.displayedColumns();
    const isHidden = displayedColumns.isHidden;
    const vin = this.selected();
    return [
      {
        type: 'selection',
        key: 'selection',
        label: $localize`Selections`,
        hidden: isHidden('selection'),
      },
      {
        label: $localize`Actions`,
        type: 'action',
        key: 'action',
        actions: [
          {
            icon: (value) =>
              value.vin === vin
                ? 'bosch-ic-close'
                : 'bosch-ic-desktop-graph-search',
            tooltip: (value) =>
              value.vin === vin ? $localize`Close Details` : $localize`Details`,
            onClick: (value) => {
              const selected = value.vin === vin ? undefined : value.vin;
              this.router.navigate([], {
                queryParams: {
                  selected,
                  vfPage: 0,
                },
                queryParamsHandling: 'merge',
              });
            },
          },
          {
            icon: () => 'bosch-ic-edit',
            tooltip: () => $localize`Edit`,
            onClick: (value) => {
              this.onEdit(value);
            },
          },
          {
            icon: () => 'bosch-ic-delete',
            tooltip: () => $localize`Delete`,
            onClick: (value) => {
              this.onDelete(value);
            },
          },
          {
            icon: () => 'bosch-ic-configuration-points-set',
            tooltip: () => $localize`Update Engine Type`,
            onClick: (value) => {
              this.onUpdateEngineType(value);
            },
            disable: (value: Vehicle) =>
              !this.isEngineTypeManuallyUpdate(value),
          },
        ],
        hidden: isHidden('action'),
      },
      {
        key: 'vin',
        label: $localize`VIN`,
        type: 'text',
        hidden: isHidden('vin'),
      },
      {
        key: 'name',
        label: $localize`Name`,
        type: 'text',
        hidden: isHidden('name'),
      },
      {
        key: 'licensePlate',
        label: $localize`License Plate`,
        type: 'text',
        hidden: isHidden('licensePlate'),
      },
      {
        key: 'manufacturerName',
        label: $localize`Manufacturer Name`,
        type: 'text',
        hidden: isHidden('manufacturerName'),
      },
      {
        key: 'modelLine',
        label: $localize`Model Line`,
        type: 'text',
        hidden: isHidden('modelLine'),
      },
      {
        key: 'modelType',
        label: $localize`Model Type`,
        type: 'text',
        hidden: isHidden('modelType'),
      },
      {
        key: 'modelYear',
        label: $localize`Model Year`,
        type: 'text',
        hidden: isHidden('modelYear'),
      },
      {
        key: 'engineType',
        label: $localize`Engine Type`,
        type: 'templateRef',
        templateRef: () => this.engineType,
        hidden: isHidden('engineType'),
      },
    ];
  });

  tableColumnConfigs = computed(() =>
    this.columnConfigs().map((config) => ({
      key: config.key,
      title: config.label,
      isChecked: !config.hidden,
    }))
  );

  changeManualEngineTypeUpdate(value: boolean) {
    this.router.navigate([], {
      queryParams: {
        needManualUpdatedEngineType: value,
        page: 0,
        selected: undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  onTableColumnConfigsChange(value: string[]) {
    this.router.navigate([], {
      queryParams: {
        displayedColumns: serializeDisplayedColumns(value),
      },
      queryParamsHandling: 'merge',
    });
  }

  onSearch(search: string): void {
    const value = search.trim();
    this.router.navigate([], {
      queryParams: {
        search: value === '' ? undefined : value,
        selected: undefined,
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPage(event: PageEvent): void {
    this.router.navigate([], {
      queryParams: {
        page: event.pageIndex,
        size: event.pageSize,
        selected: undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '60%',
      disableClose: true,
      data: {
        options: {
          engineTypes$: this.store.selectors.engineTypes$,
        },
      },
    });

    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.handleSubmit = (vehicle) => {
      this.store.createVehicle({
        vehicle: vehicle,
        handler: {
          handleLoading: (isLoading: boolean) => {
            dialogInstance.isLoading.set(isLoading);
          },
          onSuccess: () => {
            dialogRef.close();
            this.refresh();
          },
          onError: (error) => {
            if (error.code == 'VEHICLE_ALREADY_EXISTED') {
              this.dialog.open(ErrorDialogComponent, {
                width: '44rem',
                disableClose: false,
                data: {
                  title: $localize`Vehicle registration not possible`,
                  contentMessage: $localize`Vehicle with the same VIN already exists in the database.`,
                },
              });
            }
          },
        },
      });
    };
  }

  private onEdit(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(VehicleFormComponent, {
      width: '60%',
      disableClose: true,
      data: {
        vehicle,
        options: {
          engineTypes$: this.store.selectors.engineTypes$,
        },
      },
    });

    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.handleSubmit = (vehicle) => {
      this.store.editVehicle({
        vehicle: vehicle,
        handler: {
          handleLoading: (isLoading: boolean) => {
            dialogInstance.isLoading.set(isLoading);
          },
          onSuccess: () => {
            dialogRef.close();
            this.refresh();
          },
        },
      });
    };
  }

  private onDelete(vehicle: Vehicle): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '44rem',
      data: {
        title: $localize`Delete vehicle`,
        contentMessage: $localize`
          Vehicle will be deleted.
          Data will be retained for 30 days before permanent deletion.
          Restoration of deleted data is possible within 30 days via customer support.
          Are you sure you want to delete?`,
        leftButtonText: $localize`Confirm`,
        rightButtonText: $localize`Cancel`,
      },
    });

    const confirmDialog = dialogRef.componentInstance;
    confirmDialog.onClickConfirm = () => {
      this.store.deleteVehicle({
        vehicleVin: vehicle.vin,
        handler: {
          handleLoading: (isLoading: boolean) => {
            confirmDialog.isLoading.set(isLoading);
          },
          onSuccess: () => {
            dialogRef.close();
            this.refresh();
          },
        },
      });
    };
  }

  isEngineTypeManuallyUpdate(element: Vehicle): boolean {
    return element.vehicleProperties.some(
      (property) =>
        property.name === INTERNAL_LOCK_ENGINE_TYPE &&
        property.value === UPDATE_ENGINE_TYPE_MANUALLY
    );
  }

  onUpdateEngineType(data: Vehicle): void {
    const dialogRef = this.dialog.open(UpdateEngineTypeFormComponent, {
      width: '44rem',
      disableClose: true,
      data: {
        options: {
          engineTypes$: this.store.selectors.engineTypes$,
        },
      },
    });

    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.handleSubmit = (request: EngineTypeRequest) => {
      if (request) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { links, ...rest } = data;
        this.store.editVehicle({
          vehicle: { ...rest, engineType: request.engineType },
          handler: {
            handleLoading: (isLoading: boolean) => {
              dialogInstance.isLoading.set(isLoading);
            },
            onSuccess: () => {
              dialogRef.close();
              this.refresh();
            },
          },
        });
      }
    };
  }

  paging = unwrapPaging(this.store.selectors.vehicles$);
  selected = input<string | undefined>();
  selectedVehicle$ = combineLatest([
    this.paging.dataSource$,
    toObservable(this.selected),
  ]).pipe(
    map(([dataSource, vin]) =>
      dataSource.find((vehicle) => vehicle.vin === vin)
    )
  );

  vm$ = combineLatest([
    this.paging.isLoading$,
    this.paging.dataSource$,
    this.paging.errorMessage$,
    this.paging.totalElements$,
    this.selectedVehicle$,
    this.queryParams$,
  ]).pipe(
    map(
      ([
        isLoading,
        dataSource,
        errorMessage,
        totalElements,
        selectedVehicle,
      ]) => ({
        isLoading,
        dataSource,
        errorMessage,
        totalElements,
        selectedVehicle,
      })
    )
  );

  vfPage = input(0, { transform: toPageNumber });
  vfSize = input(10, { transform: toPageSize });
  vfSortDirection = input('', { transform: toSortDirection });
  vfSortBy = input('', { transform: toStringParam });
  vfSort = computed(() => {
    const sortBy = this.vfSortBy();
    const sortDirection = this.vfSortDirection();
    return toSortParam({ active: sortBy, direction: sortDirection });
  });
  vfDisplayedColumns = input(
    { isHidden: () => false },
    { transform: (value: unknown) => deserializeDisplayedColumns(value) }
  );
  vfParams = computed(() => ({
    vin: this.selected(),
    page: this.vfPage(),
    size: this.vfSize(),
    sort: this.vfSort(),
  }));
  vfQueryParams$ = toObservable(this.vfParams).pipe(
    filter(
      (
        params
      ): params is {
        vin: string;
        page: number;
        size: number;
        sort: string | undefined;
      } => Boolean(params.vin)
    ),
    map((params) => {
      const queryParams = this.toVfQueryParams(params);
      return { vin: params.vin, queryParams };
    }),
    tap((value) => this.vehicleFaultStore.getVehicleFaults(value))
  );

  private toVfQueryParams(params: {
    page: number;
    size: number;
    sort: string | undefined;
  }) {
    const queryParams: QueryParams = {};
    queryParams['page'] = params.page;
    queryParams['size'] = params.size;
    if (params.sort) {
      queryParams['sort'] = params.sort;
    }
    return queryParams;
  }

  onVfDisplayedColumnsChange(value: string[]) {
    this.router.navigate([], {
      queryParams: {
        vfDisplayedColumns: serializeDisplayedColumns(value),
      },
      queryParamsHandling: 'merge',
    });
  }

  onVfPageChange = (event: PageEvent) => {
    this.router.navigate([], {
      queryParams: {
        vfPage: event.pageIndex,
        vfSize: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  };

  onVfSortChange = (event: Sort) => {
    this.router.navigate([], {
      queryParams: {
        vfSortDirection: event.direction,
        vfSortBy: event.active,
      },
      queryParamsHandling: 'merge',
    });
  };

  openHistoryDialog = (data: RichVehicleFault) => {
    this.vehicleFaultStore.loadHistories(data);
    this.dialog
      .open(ProcessingStageDialogComponent, {
        data: this.vehicleFaultStore.selectors.vehicleFaultHistories$,
      })
      .afterClosed()
      .subscribe(() => this.vehicleFaultStore.clearHistories());
  };

  openDialogDismiss = (fault: FaultDismissInfo) => {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Dismiss Vehicle Fault`,
        contentTitle: `${fault.status} -> inactive`,
        leftButtonText: $localize`Confirm`,
        rightButtonText: $localize`Cancel`,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.vehicleFaultStore.dismissFault({
          payload: fault,
          onSuccess: () => {
            const params = this.vfParams();
            if (params.vin) {
              this.vehicleFaultStore.getVehicleFaults({
                vin: params.vin,
                queryParams: this.toVfQueryParams(params),
              });
            }
          },
        });
      }
    });
  };

  vfPaging = unwrapPaging(this.vehicleFaultStore.selectors.vehicleFaults$);
  vehicleFault$ = combineLatest([
    this.vfPaging.isLoading$,
    this.vfPaging.dataSource$,
    this.vfPaging.errorMessage$,
    this.vfPaging.totalElements$,
    this.vfQueryParams$,
  ]).pipe(
    map(([isLoading, dataSource, errorMessage, totalElements]) => ({
      isLoading,
      dataSource,
      errorMessage,
      totalElements,
    }))
  );

  deleteMany() {
    if (this.selection.isEmpty()) {
      return;
    }
    const items = this.selection.selected;
    const selectedItemsLength = items.length;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '44rem',
      data: {
        title: $localize`Delete ${selectedItemsLength} selected vehicles`,
        contentMessage: $localize`
          These vehicles will be deleted.
          Data will be retained for 30 days before permanent deletion.
          Restoration of deleted data is possible within 30 days via customer support.
          Are you sure you want to delete?`,
        leftButtonText: $localize`Confirm`,
        rightButtonText: $localize`Cancel`,
      },
    });
    const confirmDialog = dialogRef.componentInstance;
    confirmDialog.onClickConfirm = () => {
      this.store.deleteMany({
        vins: items.map((d) => d.vin),
        handler: {
          handleLoading: (isLoading: boolean) => {
            confirmDialog.isLoading.set(isLoading);
          },
          done: (value) => {
            dialogRef.close();
            this.dialog
              .open(DeletionReportComponent, {
                width: '44rem',
                data: value,
              })
              .afterClosed()
              .subscribe(() => {
                this.refresh();
              });
          },
        },
      });
    };
  }

  sizes = signal<IOutputAreaSizes>([50, 50]);
  onDragEnd(event: IOutputData) {
    this.sizes.set(event.sizes);
  }
}
