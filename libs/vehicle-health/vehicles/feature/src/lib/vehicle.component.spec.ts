/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  DtcTemplate,
  LoadingHandler,
  PagingResponseModel,
  RequestStatus,
  RichVehicleFault,
  Vehicle,
} from '@cps/types';
import {
  ActionColumn,
  ColumnConfig,
  ConfirmDialogComponent,
  ErrorDialogComponent,
} from '@cps/ui';
import {
  INTERNAL_LOCK_ENGINE_TYPE,
  UPDATE_ENGINE_TYPE_MANUALLY,
} from '@cps/vehicle-health/ui';
import { VehicleFaultStore } from '@cps/vehicle-health/vehicle-faults/data-access';
import { VehicleStore } from '@cps/vehicle-health/vehicles/data-access';
import {
  UpdateEngineTypeFormComponent,
  VehicleFormComponent,
} from '@cps/vehicle-health/vehicles/ui';
import { Observable, of, ReplaySubject } from 'rxjs';
import { VehicleComponent } from './vehicle.component';
import { By } from '@angular/platform-browser';

describe(VehicleComponent.name, () => {
  const fault1 = {
    start: new Date().toJSON(),
    end: new Date().toJSON(),
    faultDateTime: new Date().toJSON(),
    status: 'pending',
    dtcCode: 'dtcCode1',
    faultOrigin: 'faultOrigin1',
    description: 'description1',
    possibleCause: 'possibleCause1',
    possibleSymptoms: 'possibleSymptoms1',
    criticality: 'criticality1',
    recommendations: [],
    oem: 'oem1',
    protocolStandard: 'protocolStandard1',
    dtcTemplate: {} as DtcTemplate,
    vehicleName: '1',
    vin: 'vin1',
  };

  const data: Vehicle[] = [
    {
      engineType: 'Generic',
      licensePlate: 'test',
      manufacturerName: 'test',
      modelLine: 'test',
      modelType: 'test',
      modelYear: 'test',
      name: 'test',
      vehicleProperties: [
        {
          name: INTERNAL_LOCK_ENGINE_TYPE,
          value: UPDATE_ENGINE_TYPE_MANUALLY,
          defaultValue: UPDATE_ENGINE_TYPE_MANUALLY,
        },
      ],
      vin: 'vin1',
    },
    {
      engineType: 'Generic',
      licensePlate: 'test',
      manufacturerName: 'test',
      modelLine: 'test',
      modelType: 'test',
      modelYear: 'test',
      name: 'test',
      vehicleProperties: [],
      vin: 'vin2',
    },
  ];

  async function setup() {
    const vehicles$ = new ReplaySubject<
      RequestStatus<PagingResponseModel<Vehicle>>
    >();

    const vehicleStore = {
      deleteVehicle: jest.fn(),
      deleteMany: jest.fn(),
      editVehicle: jest.fn(),
      createVehicle: jest.fn(),
      searchVehicles: jest.fn(),
      selectors: {
        vehicles$: vehicles$.asObservable(),
        engineTypes$: of(['Generic', 'DNG']),
      },
    };

    const dialogRef = {
      componentInstance: {
        handleSubmit: jest.fn(),
        onClickConfirm: jest.fn(),
        isLoading: {
          set: jest.fn(),
        },
      },
      close: jest.fn(),
      afterClosed: jest.fn(),
    };

    const dialog = {
      open: jest.fn().mockReturnValue(dialogRef),
    };

    const vehicleFaults = new ReplaySubject<
      RequestStatus<PagingResponseModel<RichVehicleFault>>
    >();

    const vehicleFaultHistories = new ReplaySubject<
      RequestStatus<{
        histories: [];
        loading: false;
      }>
    >();

    const vehicleFaultStore = {
      dismissFault: jest.fn(),
      getVehicleFaults: jest.fn(),
      clearHistories: jest.fn(),
      loadHistories: jest.fn(),
      selectors: {
        vehicleFaults$: vehicleFaults.asObservable(),
        vehicleFaultHistories$: vehicleFaultHistories.asObservable(),
      },
    };

    vehicleFaultStore.getVehicleFaults.mockReturnValue(
      of({
        data: {
          content: [fault1],
          links: [],
          page: {
            size: 10,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        },
        loadingState: 'loaded',
      })
    );

    vehicleFaultStore.loadHistories.mockReturnValue(
      of({
        isLoading: false,
        histories: [],
      })
    );

    await TestBed.configureTestingModule({
      imports: [VehicleComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter(
          [{ path: '**', component: VehicleComponent }],
          withComponentInputBinding()
        ),
      ],
    }).compileComponents();

    TestBed.overrideProvider(VehicleStore, {
      useValue: vehicleStore,
    });
    TestBed.overrideProvider(MatDialog, { useValue: dialog });
    TestBed.overrideProvider(VehicleFaultStore, {
      useValue: vehicleFaultStore,
    });

    const fixture = TestBed.createComponent(VehicleComponent);
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    const component = fixture.componentInstance;
    vehicles$.next({
      loadingState: 'loaded',
      data: {
        content: data,
        links: [],
        page: {
          totalPages: 1,
          number: 0,
          size: 10,
          totalElements: 2,
        },
      },
    });
    fixture.detectChanges();

    return {
      component,
      fixture,
      vehicleStore,
      dialog,
      dialogRef,
      vehicles$,
      harness,
      router,
      vehicleFaultStore,
    };
  }

  function getActionButton(
    component: VehicleComponent,
    action: 'edit' | 'delete' | 'configuration-points-set'
  ) {
    return component
      .columnConfigs()
      .filter(
        (d): d is ColumnConfig<Vehicle> & ActionColumn<Vehicle> =>
          d.type === 'action'
      )
      .flatMap((d) => d.actions)
      .find((d) => d.icon({} as unknown as Vehicle) === `bosch-ic-${action}`);
  }

  describe('toggle details', () => {
    it('should select query parameter', async () => {
      const { harness, router } = await setup();
      await harness.navigateByUrl('?page=0&size=10', VehicleComponent);
      harness.detectChanges();
      const iconDebugEl = harness.fixture.debugElement.query(
        By.css('[fonticon="bosch-ic-desktop-graph-search"]')
      );
      iconDebugEl.nativeElement.click();
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: {
          selected: 'vin1',
          vfPage: 0,
        },
        queryParamsHandling: 'merge',
      });
    });

    it('should deselect query parameter', async () => {
      const { harness, router } = await setup();
      await harness.navigateByUrl(
        '?page=0&size=10&selected=vin1',
        VehicleComponent
      );
      harness.detectChanges();
      const iconDebugEl = harness.fixture.debugElement.query(
        By.css('[fonticon="bosch-ic-close"]')
      );
      iconDebugEl.nativeElement.click();
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: {
          selected: undefined,
          vfPage: 0,
        },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('create vehicle', () => {
    it('should open create dialog', async () => {
      const { component, vehicleStore, dialog } = await setup();
      component.onAdd();
      expect(dialog.open).toHaveBeenCalledWith(VehicleFormComponent, {
        width: '60%',
        disableClose: true,
        data: {
          options: {
            engineTypes$: vehicleStore.selectors.engineTypes$,
          },
        },
      });
    });

    it('should call add vehicle if data is valid', async () => {
      const { component, dialogRef, vehicleStore } = await setup();
      const mockVehicle = {
        vin: 'vin',
      } as Vehicle;

      vehicleStore.createVehicle.mockImplementation(
        (createParam: { vehicle: Vehicle; handler: LoadingHandler }) => {
          createParam.handler.handleLoading(true);
          createParam.handler.handleLoading(false);
          createParam.handler.onSuccess();
          return new Observable().subscribe();
        }
      );

      component.onAdd();
      dialogRef.componentInstance.handleSubmit(mockVehicle);

      const arg = vehicleStore.createVehicle.mock.calls[0][0];
      expect(vehicleStore.createVehicle).toHaveBeenCalledTimes(1);
      expect(arg.vehicle).toEqual(mockVehicle);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should open ErrorDialogComponent  if create error with VEHICLE_ALREADY_EXISTED', async () => {
      const { component, dialogRef, vehicleStore, dialog } = await setup();
      const mockVehicle = {
        vin: 'vin',
      } as Vehicle;

      vehicleStore.createVehicle.mockImplementation(
        (createParam: { vehicle: Vehicle; handler: LoadingHandler }) => {
          createParam.handler.handleLoading(true);
          createParam.handler.handleLoading(false);
          if (createParam.handler.onError) {
            createParam.handler.onError({
              code: 'VEHICLE_ALREADY_EXISTED',
              message: 'Vehicle already existed',
            });
          }
          return new Observable().subscribe();
        }
      );

      component.onAdd();
      dialogRef.componentInstance.handleSubmit(mockVehicle);

      expect(dialog.open).toHaveBeenCalledWith(ErrorDialogComponent, {
        disableClose: false,
        width: '44rem',
        data: {
          title: 'Vehicle registration not possible',
          contentMessage:
            'Vehicle with the same VIN already exists in the database.',
        },
      });
    });

    it('should do nothing if close dialog notification has not data', async () => {
      const { component, vehicleStore } = await setup();
      component.onAdd();
      expect(vehicleStore.createVehicle).not.toHaveBeenCalled();
    });
  });

  describe('update vehicle', () => {
    it('should open dialog update', async () => {
      const { component, dialog, fixture, vehicleStore } = await setup();
      fixture.detectChanges();
      const mockVehicle = {
        vin: 'vin',
      } as Vehicle;
      const editBtn = getActionButton(component, 'edit')!;
      editBtn.onClick!(mockVehicle);
      expect(dialog.open).toHaveBeenCalledWith(VehicleFormComponent, {
        width: '60%',
        disableClose: true,
        data: {
          vehicle: mockVehicle,
          options: {
            engineTypes$: vehicleStore.selectors.engineTypes$,
          },
        },
      });
    });

    it('should call update vehicle if data is valid', async () => {
      const { component, dialogRef, vehicleStore } = await setup();
      const mockVehicle = {
        vin: 'vin',
      } as Vehicle;
      vehicleStore.editVehicle.mockImplementation(
        (createParam: { handler: LoadingHandler }) => {
          createParam.handler.handleLoading(true);
          createParam.handler.handleLoading(false);
          createParam.handler.onSuccess();
          return new Observable().subscribe();
        }
      );
      const editBtn = getActionButton(component, 'edit')!;
      const mockUpdateVehicle = {
        vin: 'vin',
      } as Vehicle;

      editBtn.onClick!(mockVehicle);
      dialogRef.componentInstance.handleSubmit(mockUpdateVehicle);

      const args = vehicleStore.editVehicle.mock.calls[0][0];
      expect(vehicleStore.editVehicle).toHaveBeenCalledTimes(1);
      expect(args.vehicle).toEqual(mockUpdateVehicle);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if close dialog notification has not data', async () => {
      const { component, vehicleStore } = await setup();
      const editBtn = getActionButton(component, 'edit')!;
      editBtn.onClick!({} as Vehicle);
      expect(vehicleStore.editVehicle).not.toHaveBeenCalled();
    });
  });

  describe('delete vehicle', () => {
    it('should open confirm dialog', async () => {
      const { component, dialog } = await setup();
      const deleteBtn = getActionButton(component, 'delete')!;
      deleteBtn.onClick!({} as Vehicle);
      expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        width: '44rem',
        data: {
          title: 'Delete vehicle',
          contentMessage: `
          Vehicle will be deleted. 
          Data will be retained for 30 days before permanent deletion. 
          Restoration of deleted data is possible within 30 days via customer support. 
          Are you sure you want to delete?`,
          leftButtonText: 'Confirm',
          rightButtonText: 'Cancel',
        },
      });
    });
    it('should call delete when onClickConfirm is called', async () => {
      const { component, dialogRef, vehicleStore } = await setup();
      const mockVehicle = {
        vin: 'vin',
      } as Vehicle;
      const deleteBtn = getActionButton(component, 'delete')!;
      deleteBtn.onClick!(mockVehicle);
      dialogRef.componentInstance.onClickConfirm();

      expect(vehicleStore.deleteVehicle).toHaveBeenCalled();
    });

    it('should set confirmDialog.isLoading when handleLoading is called', async () => {
      const { component, dialogRef, vehicleStore } = await setup();
      const mockDeleteVehicle = {
        vin: 'vin',
      } as Vehicle;
      const deleteBtn = getActionButton(component, 'delete');
      deleteBtn!.onClick!(mockDeleteVehicle);

      vehicleStore.deleteVehicle.mockImplementation(
        (args: { handler: LoadingHandler }) => {
          args.handler.handleLoading(true);
          args.handler.handleLoading(false);
          args.handler.onSuccess();
          return new Observable().subscribe();
        }
      );

      dialogRef.componentInstance.onClickConfirm();
      const deleteArg = vehicleStore.deleteVehicle.mock.calls[0][0];

      expect(vehicleStore.deleteVehicle).toHaveBeenCalled();
      expect(deleteArg.vehicleVin).toEqual(mockDeleteVehicle.vin);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should do nothing when confirm false', async () => {
      const { component, vehicleStore } = await setup();
      const deleteBtn = getActionButton(component, 'delete')!;
      deleteBtn.onClick!({} as Vehicle);
      expect(vehicleStore.deleteVehicle).not.toHaveBeenCalled();
    });
  });

  it('should return true when internal_lock_engine_type is update_engine_type_manually', async () => {
    const { component } = await setup();

    const vehicle = {
      vehicleProperties: [
        {
          name: INTERNAL_LOCK_ENGINE_TYPE,
          value: UPDATE_ENGINE_TYPE_MANUALLY,
          defaultValue: '',
        },
      ],
    } as Vehicle;
    const result = component.isEngineTypeManuallyUpdate(vehicle);
    expect(result).toBe(true);
  });

  it('should return false when internal_lock_engine_type has a different value', async () => {
    const { component } = await setup();

    const vehicle = {
      vehicleProperties: [
        {
          name: INTERNAL_LOCK_ENGINE_TYPE,
          value: 'manually_updated',
          defaultValue: '',
        },
      ],
    } as Vehicle;
    const result = component.isEngineTypeManuallyUpdate(vehicle);
    expect(result).toBe(false);
  });

  describe('update engine type', () => {
    it('should open dialog update engine type', async () => {
      const { component, dialog, fixture, vehicleStore } = await setup();
      fixture.detectChanges();
      const mockVehicle = {
        vin: 'vin',
      } as Vehicle;
      const updateEngineTypeBtn = getActionButton(
        component,
        'configuration-points-set'
      )!;
      updateEngineTypeBtn.onClick!(mockVehicle);
      expect(dialog.open).toHaveBeenCalledWith(UpdateEngineTypeFormComponent, {
        width: '44rem',
        disableClose: true,
        data: {
          options: {
            engineTypes$: vehicleStore.selectors.engineTypes$,
          },
        },
      });
    });

    it('should do nothing if close dialog notification has not data', async () => {
      const { component, vehicleStore } = await setup();
      const updateEngineTypeBtn = getActionButton(
        component,
        'configuration-points-set'
      )!;
      updateEngineTypeBtn.onClick!({} as Vehicle);
      expect(vehicleStore.editVehicle).not.toHaveBeenCalled();
    });
  });

  it('should set dialog.isLoading when handleLoading is called', async () => {
    const { component, dialogRef, vehicleStore } = await setup();
    const mockUpdateVehicle = {
      engineType: 'Diesel',
      links: ['https://example.org'],
    } as Vehicle;
    const updateEngineTypeBtn = getActionButton(
      component,
      'configuration-points-set'
    )!;
    updateEngineTypeBtn.onClick!(mockUpdateVehicle);

    vehicleStore.editVehicle.mockImplementation(
      (arg: { handler: LoadingHandler }) => {
        arg.handler.handleLoading(true);
        arg.handler.handleLoading(false);
        arg.handler.onSuccess();
        return new Observable().subscribe();
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { links, ...vehicleWithoutLink } = mockUpdateVehicle;

    dialogRef.componentInstance.handleSubmit(mockUpdateVehicle);
    const args = vehicleStore.editVehicle.mock.calls[0][0];
    expect(vehicleStore.editVehicle).toHaveBeenCalledTimes(1);
    expect(args.vehicle).toEqual(vehicleWithoutLink);
    expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(2);
    expect(dialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('onSearch', async () => {
    const { component, router } = await setup();
    component.onSearch('test');
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        search: 'test',
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('onPage', async () => {
    const { component, router } = await setup();
    component.onPage({ pageIndex: 1, pageSize: 10, length: 100 });
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        page: 1,
        size: 10,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('onTableColumnConfigsChange', async () => {
    const { component, router } = await setup();
    component.onTableColumnConfigsChange(['a', 'b']);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        displayedColumns: 'a,b',
      },
      queryParamsHandling: 'merge',
    });
  });

  it('changeManualEngineTypeUpdate', async () => {
    const { component, router } = await setup();
    component.changeManualEngineTypeUpdate(true);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        needManualUpdatedEngineType: true,
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should search by page = 0, size = 10, needManualUpdatedEngineType = true', async () => {
    const { harness, vehicleStore } = await setup();
    await harness.navigateByUrl(
      '?page=0&size=10&needManualUpdatedEngineType=true&search=test',
      VehicleComponent
    );
    expect(vehicleStore.searchVehicles).toHaveBeenCalledWith({
      page: 0,
      size: 10,
      needManualUpdatedEngineType: true,
      search: 'test',
    });
  });

  describe('vehicle faults', () => {
    it('should load vehicle faults', async () => {
      const { harness, vehicleFaultStore } = await setup();
      await harness.navigateByUrl(
        '?page=0&size=10&selected=vin1&vfPage=0&vfSize=10&vfSortBy=start&vfSortDirection=asc',
        VehicleComponent
      );
      harness.detectChanges();
      await harness.fixture.whenStable();
      expect(vehicleFaultStore.getVehicleFaults).toHaveBeenCalled();
    });

    it('onDisplayedColumnsChange', async () => {
      const { component, router } = await setup();
      component.onVfDisplayedColumnsChange(['start', 'end']);
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: {
          vfDisplayedColumns: 'start,end',
        },
        queryParamsHandling: 'merge',
      });
    });

    it('onPageChange', async () => {
      const { component, router } = await setup();
      component.onVfPageChange({ pageIndex: 1, pageSize: 10, length: 100 });
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: {
          vfPage: 1,
          vfSize: 10,
        },
        queryParamsHandling: 'merge',
      });
    });

    it('onSortChange', async () => {
      const { component, router } = await setup();
      component.onVfSortChange({ active: 'start', direction: 'asc' });
      expect(router.navigate).toHaveBeenCalledWith([], {
        queryParams: {
          vfSortBy: 'start',
          vfSortDirection: 'asc',
        },
        queryParamsHandling: 'merge',
      });
    });

    it('openHistoryDialog', async () => {
      const { component, vehicleFaultStore, dialogRef } = await setup();
      dialogRef.afterClosed.mockReturnValue(of(true));
      component.openHistoryDialog(fault1);
      expect(vehicleFaultStore.loadHistories).toHaveBeenCalledWith(fault1);
      expect(vehicleFaultStore.clearHistories).toHaveBeenCalled();
    });

    it('openDialogDismiss', async () => {
      const { vehicleFaultStore, dialogRef, harness } = await setup();
      const component = await harness.navigateByUrl(
        '?selected=vin1',
        VehicleComponent
      );
      dialogRef.afterClosed.mockReturnValue(of(true));
      vehicleFaultStore.dismissFault.mockImplementation(({ onSuccess }) => {
        onSuccess();
        return new Observable().subscribe();
      });
      component.openDialogDismiss(fault1);

      const args = vehicleFaultStore.dismissFault.mock.calls[0][0];
      expect(args.payload).toEqual(fault1);
      expect(vehicleFaultStore.getVehicleFaults).toHaveBeenCalled();
    });
  });

  describe('onDragEnd', () => {
    it('should update sizes', async () => {
      const { component } = await setup();
      component.onDragEnd({ gutterNum: 1, sizes: [40, 60] });
      expect(component.sizes()).toEqual([40, 60]);
    });
  });

  describe('deleteMany', () => {
    it('should do nothing', async () => {
      const { component, dialog } = await setup();
      component.deleteMany();
      expect(dialog.open).not.toHaveBeenCalled();
    });

    it('should show delete many button', async () => {
      const { component, dialogRef, vehicleStore } = await setup();

      vehicleStore.deleteMany.mockImplementation(
        (args: {
          handler: {
            handleLoading: (value: boolean) => void;
            done: (
              value: {
                vin: string;
                hasError: boolean;
                timestamp: string;
                code: string;
                reason: string;
              }[]
            ) => void;
          };
        }) => {
          args.handler.handleLoading(true);
          args.handler.handleLoading(false);
          args.handler.done([
            {
              code: 'SUCCESS',
              hasError: false,
              reason: '',
              timestamp: '2024-01-01T00:00Z',
              vin: 'vin1',
            },
            {
              code: 'ERROR',
              hasError: true,
              reason: 'FAIL',
              timestamp: '2024-01-01T00:01Z',
              vin: 'vin2',
            },
          ]);
          return new Observable().subscribe();
        }
      );
      dialogRef.afterClosed.mockReturnValueOnce(of(true));

      component.selection.select(...data);
      component.deleteMany();
      dialogRef.componentInstance.onClickConfirm();

      const args = vehicleStore.deleteMany.mock.calls[0][0];
      expect(args.vins).toEqual(['vin1', 'vin2']);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });
  });
});
