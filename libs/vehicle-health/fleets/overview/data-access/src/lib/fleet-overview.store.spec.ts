import { TestBed } from '@angular/core/testing';
import {
  ApiResponseModel,
  BatteryStatus,
  ErrorRequestStatus,
  FleetOverview,
  LoadedRequestStatus,
  PagingResponseModel,
  PowertrainAnomaly,
} from '@cps/types';
import { ToastService } from '@cps/ui';
import {
  BatteryHealthService,
  FleetService,
  PowertrainAnomalyService,
} from '@cps/vehicle-health/data-access';
import { provideComponentStore } from '@ngrx/component-store';
import { filter, map, ReplaySubject } from 'rxjs';
import { FleetOverviewStore } from './fleet-overview.store';

describe(FleetOverviewStore.name, () => {
  function setup() {
    const fleets$ = new ReplaySubject<
      ApiResponseModel<PagingResponseModel<FleetOverview>>
    >();

    const mockFleetService = {
      fetchFleetOverview: jest.fn(),
    };
    mockFleetService.fetchFleetOverview.mockImplementation(() =>
      fleets$.asObservable()
    );

    const mockToastService = {
      error: jest.fn(),
      success: jest.fn(),
    };

    const batteryHealthService = {
      getLatestBatteryStatus: jest.fn(),
    };

    const batteryUsecase$ = new ReplaySubject<
      ApiResponseModel<BatteryStatus>
    >();

    const paService = {
      getLatestPowertrainAnomaly: jest.fn(),
    };

    const paUsecase$ = new ReplaySubject<ApiResponseModel<PowertrainAnomaly>>();

    TestBed.configureTestingModule({
      providers: [
        provideComponentStore(FleetOverviewStore),
        { provide: FleetService, useValue: mockFleetService },
        { provide: ToastService, useValue: mockToastService },
        { provide: BatteryHealthService, useValue: batteryHealthService },
        { provide: PowertrainAnomalyService, useValue: paService },
      ],
    });
    const store = TestBed.inject(FleetOverviewStore);
    return {
      store,
      mockFleetService,
      mockToastService,
      fleets$,
      batteryHealthService,
      batteryUsecase$,
      paUsecase$,
      paService,
    };
  }

  it('should search fleet overview', (done) => {
    const { store, fleets$ } = setup();
    const expectedData = {
      content: [],
      links: [],
      page: {
        number: 0,
        size: 0,
        totalElements: 0,
        totalPages: 0,
      },
    };
    fleets$.next({
      code: '',
      data: expectedData,
      timestamp: '',
    });
    store.searchFleets({});
    store.selectors.fleetOverviewPage$
      .pipe(
        filter((d) => d.loadingState === 'loaded'),
        map((d) => d.data)
      )
      .subscribe((data) => {
        expect(data).toEqual(expectedData);
        done();
      });
  });

  it('should show toast.error after search failed', () => {
    const { store, fleets$, mockToastService } = setup();
    fleets$.error({ error: { message: 'error' } });
    store.searchFleets({});
    expect(mockToastService.error).toHaveBeenCalled();
  });

  describe('loadBatteryHealth', () => {
    it('should dispatch loading state and fetch battery health', async () => {
      const mockVin = 'ABC12345';
      const { store, batteryUsecase$, batteryHealthService } = setup();

      const getLatestBatteryStatusSpy = jest
        .spyOn(batteryHealthService, 'getLatestBatteryStatus')
        .mockReturnValue(batteryUsecase$);

      store.loadBatteryHealth(mockVin);

      store.selectors.pdUsecase$
        .pipe(
          filter(
            (pdUsecase) =>
              pdUsecase[mockVin]?.batteryHealth?.loadingState === 'loaded'
          ),
          map((pdUsecase) => {
            const batteryHealth = pdUsecase[mockVin]
              ?.batteryHealth as LoadedRequestStatus<BatteryStatus>;
            return batteryHealth.data ?? {};
          })
        )
        .subscribe((data) => {
          expect(getLatestBatteryStatusSpy).toHaveBeenCalledWith(mockVin);
          expect(data).toEqual(batteryUsecase$);
        });
    });

    it('should handle error during battery health fetch', async () => {
      const { store, batteryUsecase$, batteryHealthService } = setup();

      const mockVin = 'ABC12345';
      const mockError = 'Error fetching battery health';
      const getLatestBatteryStatusSpy = jest
        .spyOn(batteryHealthService, 'getLatestBatteryStatus')
        .mockReturnValue(batteryUsecase$);

      store.loadBatteryHealth(mockVin);
      store.selectors.pdUsecase$
        .pipe(
          filter(
            (pdUsecase) =>
              pdUsecase[mockVin]?.batteryHealth?.loadingState === 'error'
          ),
          map((pdUsecase) => {
            const batteryHealth = pdUsecase[mockVin]
              ?.batteryHealth as ErrorRequestStatus;
            return batteryHealth.message;
          })
        )
        .subscribe((message) => {
          expect(getLatestBatteryStatusSpy).toHaveBeenCalledWith(mockVin);
          expect(message).toBe(mockError);
        });
    });
  });

  describe('loadAnomalies', () => {
    it('should dispatch loading state and fetch powertrain anomalies', async () => {
      const mockVin = 'ABC12345';
      const { store, paUsecase$, paService } = setup();
      const getLatestPowertrainAnomalySpy = jest
        .spyOn(paService, 'getLatestPowertrainAnomaly')
        .mockReturnValue(paUsecase$);

      store.loadAnomalies(mockVin);

      store.selectors.pdUsecase$
        .pipe(
          filter(
            (pdUsecase) =>
              pdUsecase[mockVin]?.powertrainAnomaly?.loadingState === 'loaded'
          ),
          map((pdUsecase) => {
            const pa = pdUsecase[mockVin]
              ?.powertrainAnomaly as LoadedRequestStatus<PowertrainAnomaly>;
            return pa.data ?? {};
          })
        )
        .subscribe((data) => {
          expect(getLatestPowertrainAnomalySpy).toHaveBeenCalledWith(mockVin);
          expect(data).toEqual(paUsecase$);
        });
    });

    it('should handle error during powertrain anomaly fetch', async () => {
      const mockVin = 'ABC12345';
      const { store, paUsecase$, paService } = setup();
      const getLatestPowertrainAnomalySpy = jest
        .spyOn(paService, 'getLatestPowertrainAnomaly')
        .mockReturnValue(paUsecase$);
      const mockError = 'Error fetching battery health';

      store.loadAnomalies(mockVin);

      store.selectors.pdUsecase$
        .pipe(
          filter(
            (pdUsecase) =>
              pdUsecase[mockVin]?.powertrainAnomaly?.loadingState === 'error'
          ),
          map((pdUsecase) => {
            const pa = pdUsecase[mockVin]
              ?.powertrainAnomaly as ErrorRequestStatus;
            return pa.message;
          })
        )
        .subscribe((message) => {
          expect(getLatestPowertrainAnomalySpy).toHaveBeenCalledWith(mockVin);
          expect(message).toBe(mockError);
        });
    });
  });
});
