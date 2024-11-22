import { TestBed } from '@angular/core/testing';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  Router,
  RouterModule,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { FleetOverview, PagingResponseModel, RequestStatus } from '@cps/types';
import {
  FleetOverviewStore,
  PdUsecase,
} from '@cps/vehicle-health/fleets/overview/data-access';
import { ReplaySubject } from 'rxjs';
import { FleetOverviewComponent } from './fleet-overview.component';

describe(FleetOverviewComponent.name, () => {
  async function setup() {
    const fleetOverviewPage$ = new ReplaySubject<
      RequestStatus<PagingResponseModel<FleetOverview>>
    >();

    const pdUsecase$ = new ReplaySubject<PdUsecase>();

    const store = {
      searchFleets: jest.fn(),
      loadBatteryHealth: jest.fn(),
      loadAnomalies: jest.fn(),
      selectors: {
        fleetOverviewPage$: fleetOverviewPage$.asObservable(),
        pdUsecase$: pdUsecase$.asObservable(),
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        FleetOverviewComponent,
        RouterModule.forRoot([
          { path: '**', component: FleetOverviewComponent },
        ]),
      ],
      providers: [
        provideNoopAnimations(),
        provideRouter(
          [{ path: '**', component: FleetOverviewComponent }],
          withComponentInputBinding()
        ),
      ],
    }).compileComponents();

    TestBed.overrideProvider(FleetOverviewStore, {
      useValue: store,
    });

    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(FleetOverviewComponent);
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    const component = fixture.componentInstance;

    fleetOverviewPage$.next({
      data: {
        content: [
          {
            vin: '1HGCM82633A004352',
            lastUpdated: '2024-08-19T14:35:00Z',
            lastSeen: '2024-08-19T14:35:00Z',
            startTime: '2024-08-19T14:00:00Z',
            status: 'Active',
            source: 'Telematics',
            dtcCode: 'P0302',
            oem: 'Honda',
            protocolStandard: 'OBD-II',
            name: 'Vehicle Diagnostics',
            licensePlate: 'XYZ1234',
            manufacturerName: 'Honda',
            modelLine: 'Accord',
            engineType: 'V6',
            customer: 'John Doe',
            dtcTemplateId: 'DTC-12345',
            category: 'Engine',
            description: 'Cylinder 2 Misfire Detected',
            criticality: 'Medium',
            criticalityLevel: 3,
            symptom: 'Rough idle',
            recommendations: [
              'Check spark plug',
              'Inspect fuel injector',
              'Test compression',
            ],
            totalFaults: 1,
            odometer: 65230,
            longitude: -117.1611,
            latitude: 32.7157,
            lastUpdatedFault: '2024-08-19T14:30:00Z',
            riskAvailabilityLevel: 2,
            riskDamageLevel: 3,
            riskEmissionsLevel: 1,
            riskSafetyLevel: 2,
          },
        ],
        links: [],
        page: {
          number: 0,
          size: 1,
          totalElements: 1,
          totalPages: 1,
        },
      },
      loadingState: 'loaded',
    });

    pdUsecase$.next({
      '1HGCM82633A004352': {
        batteryHealth: {
          data: {
            category: 'Good',
            recommendation: 'No',
            sohStatus: 1,
            sohValue: 1,
            timestamp: '',
            vin: '1HGCM82633A004352',
          },
          loadingState: 'loaded',
        },
      },
    });

    return { component, fixture, store, fleetOverviewPage$, harness, router };
  }

  describe('sort', () => {
    it('should bind sort correctly', async () => {
      const { harness } = await setup();
      const component = await harness.navigateByUrl(
        '/fleet-overview?sortDirection=asc&sortBy=name',
        FleetOverviewComponent
      );
      expect(component.sort()).toBe('name,asc');
    });
  });

  describe('queryParams$', () => {
    it('should search by page = 0, size = 5, sort=name,asc and search=test', async () => {
      const { harness, store } = await setup();
      const component = await harness.navigateByUrl(
        '/fleet-overview?sortDirection=asc&sortBy=name&page=0&size=1&search=test',
        FleetOverviewComponent
      );
      component.queryParams$.subscribe();
      expect(store.searchFleets).toHaveBeenCalledWith({
        page: 0,
        size: 5,
        sort: 'name,asc',
        search: 'test',
      });
    });
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
    component.onSortChange({ active: 'name', direction: 'asc' });
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        sortBy: 'name',
        sortDirection: 'asc',
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should invoke store.loadBatteryHealth when invoke onLoadBatteryHealth', async () => {
    const { component, store } = await setup();
    const vin = 'vin';
    component.onLoadBatteryHealth(vin);
    expect(store.loadBatteryHealth).toHaveBeenCalledWith(vin);
  });

  it('should invoke store.loadAnomalies when invoke onLoadAnomalies', async () => {
    const { component, store } = await setup();
    const vin = 'vin';
    component.onLoadAnomalies(vin);
    expect(store.loadAnomalies).toHaveBeenCalledWith(vin);
  });
});
