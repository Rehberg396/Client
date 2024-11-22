import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  DtcTemplate,
  PagingResponseModel,
  RequestStatus,
  RichVehicleFault,
} from '@cps/types';
import { VehicleFaultStore } from '@cps/vehicle-health/vehicle-faults/data-access';
import { Observable, of, ReplaySubject } from 'rxjs';
import { FeatVehicleFaultsComponent } from './feat-vehicle-faults.component';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
} from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MatDialog } from '@angular/material/dialog';

describe(FeatVehicleFaultsComponent.name, () => {
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
    vin: '1',
  };

  async function setup() {
    const dialogRef = {
      afterClosed: jest.fn(),
    };

    const dialog = {
      open: jest.fn().mockReturnValue(dialogRef),
    };

    await TestBed.configureTestingModule({
      imports: [FeatVehicleFaultsComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter(
          [
            {
              path: ':vin',
              component: FeatVehicleFaultsComponent,
            },
          ],
          withComponentInputBinding()
        ),
        {
          provide: MatDialog,
          useValue: dialog,
        },
      ],
    }).compileComponents();

    const vehicleFaults = new ReplaySubject<
      RequestStatus<PagingResponseModel<RichVehicleFault>>
    >();

    const vehicleFaultHistories = new ReplaySubject<
      RequestStatus<{
        histories: [];
        loading: false;
      }>
    >();

    const store = {
      dismissFault: jest.fn(),
      getVehicleFaults: jest.fn(),
      clearHistories: jest.fn(),
      loadHistories: jest.fn(),
      selectors: {
        vehicleFaults$: vehicleFaults.asObservable(),
        vehicleFaultHistories$: vehicleFaultHistories.asObservable(),
      },
    };

    store.getVehicleFaults.mockReturnValue(
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

    store.loadHistories.mockReturnValue(
      of({
        isLoading: false,
        histories: [],
      })
    );

    TestBed.overrideProvider(VehicleFaultStore, {
      useValue: store,
    });

    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    const component = await harness.navigateByUrl(
      '/vin1?page=0&size=10&sortBy=start&sortDirection=asc&displayedColumns=start,end',
      FeatVehicleFaultsComponent
    );
    const fixture = harness.fixture;
    harness.detectChanges();
    await harness.fixture.whenStable();

    return {
      component,
      fixture,
      harness,
      store,
      router,
      vehicleFaults,
      dialogRef,
    };
  }

  it('should call store.getVehicleFaults', async () => {
    const { store } = await setup();
    expect(store.getVehicleFaults).toHaveBeenCalledWith({
      vin: 'vin1',
      queryParams: {
        page: 0,
        size: 10,
        sort: 'start,asc',
      },
    });
  });

  it('onDisplayedColumnsChange', async () => {
    const { component, router } = await setup();
    component.onDisplayedColumnsChange(['start', 'end']);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        displayedColumns: 'start,end',
      },
      queryParamsHandling: 'merge',
    });
  });

  it('onPageChange', async () => {
    const { component, router } = await setup();
    component.onPageChange({ pageIndex: 1, pageSize: 10, length: 100 });
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        page: 1,
        size: 10,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('onSortChange', async () => {
    const { component, router } = await setup();
    component.onSortChange({ active: 'start', direction: 'asc' });
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        sortBy: 'start',
        sortDirection: 'asc',
      },
      queryParamsHandling: 'merge',
    });
  });

  it('openHistoryDialog', async () => {
    const { component, store, dialogRef } = await setup();
    dialogRef.afterClosed.mockReturnValue(of(true));
    component.openHistoryDialog(fault1);
    expect(store.loadHistories).toHaveBeenCalledWith(fault1);
    expect(store.clearHistories).toHaveBeenCalled();
  });

  it('openDialogDismiss', async () => {
    const { component, store, dialogRef } = await setup();
    dialogRef.afterClosed.mockReturnValue(of(true));
    store.dismissFault.mockImplementation(({ onSuccess }) => {
      onSuccess();
      return new Observable().subscribe();
    });
    component.openDialogDismiss(fault1);

    const args = store.dismissFault.mock.calls[0][0];
    expect(args.payload).toEqual(fault1);
    expect(store.getVehicleFaults).toHaveBeenCalled();
  });
});
