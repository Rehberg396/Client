import { TestBed } from '@angular/core/testing';
import {
  ApiResponseModel,
  BatteryStatus,
  DtcTemplateGroup,
  FleetOverview,
  PowertrainAnomaly,
  PowertrainAnomalyHistory,
  Vehicle,
} from '@cps/types';
import {
  BatteryHealthService,
  DtcCategoryGroupService,
  FleetService,
  PowertrainAnomalyService,
  VehicleService,
} from '@cps/vehicle-health/data-access';
import { provideComponentStore } from '@ngrx/component-store';
import { filter, of, ReplaySubject } from 'rxjs';
import { VehicleDetailStore } from './vehicle-detail.store';

describe(VehicleDetailStore.name, () => {
  function setup() {
    const vehicleResponse$ = new ReplaySubject<ApiResponseModel<Vehicle>>();

    const batteryResponse$ = new ReplaySubject<
      ApiResponseModel<BatteryStatus>
    >();

    const paResponse$ = new ReplaySubject<
      ApiResponseModel<PowertrainAnomaly>
    >();

    const paHistoryResponse$ = new ReplaySubject<
      ApiResponseModel<PowertrainAnomalyHistory>
    >();

    const dtcGroupResponse$ = new ReplaySubject<
      ApiResponseModel<DtcTemplateGroup[]>
    >();

    const fleetOverviewResponse$ = new ReplaySubject<
      ApiResponseModel<FleetOverview>
    >();

    const vehicleService = {
      getById: () => vehicleResponse$.asObservable(),
    };

    const dtcCategoryGroupService = {
      getDtcGroups: () => dtcGroupResponse$.asObservable(),
    };

    const batteryHealthService = {
      getBatteryStatus: () => batteryResponse$.asObservable(),
    };

    const paService = {
      getLatestPowertrainAnomaly: () => paResponse$.asObservable(),
      getPowertrainAnomalyHistory: () => paHistoryResponse$.asObservable(),
    };

    const fleetService = {
      fetchFleetOverview: of(),
      fetchOneFleetOverview: () => fleetOverviewResponse$.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideComponentStore(VehicleDetailStore),
        { provide: VehicleService, useValue: vehicleService },
        { provide: DtcCategoryGroupService, useValue: dtcCategoryGroupService },
        { provide: FleetService, useValue: fleetService },
        { provide: BatteryHealthService, useValue: batteryHealthService },
        { provide: PowertrainAnomalyService, useValue: paService },
      ],
    });

    const store = TestBed.inject(VehicleDetailStore);

    return {
      store,
      vehicleResponse$,
      vehicleService,
      fleetService,
      fleetOverviewResponse$,
      batteryHealthService,
      batteryResponse$,
      dtcCategoryGroupService,
      dtcGroupResponse$,
      paResponse$,
      paService,
      paHistoryResponse$,
    };
  }

  describe('loadVehicle', () => {
    it('success', async () => {
      const { store, vehicleResponse$ } = setup();
      const data = {
        vin: 'test',
      } as unknown as Vehicle;
      vehicleResponse$.next({
        code: 'SUCCESS',
        data: data,
        timestamp: '',
      });
      store.loadVehicle('test');
      store.selectors.vehicle$
        .pipe(filter((d) => d.loadingState === 'loaded'))
        .subscribe((res) => {
          expect(res.data).toEqual(data);
        });
    });

    it('error', async () => {
      const { store, vehicleResponse$ } = setup();
      vehicleResponse$.error({ message: 'error' });
      store.loadVehicle('test');
      store.selectors.vehicle$
        .pipe(filter((d) => d.loadingState === 'error'))
        .subscribe((data) => {
          expect(data.message).toBe('error');
        });
    });
  });

  describe('loadOneFleetOverview', () => {
    it('success', async () => {
      const { store, fleetOverviewResponse$ } = setup();
      const data = {
        vin: 'test',
      } as unknown as FleetOverview;
      fleetOverviewResponse$.next({
        code: 'SUCCESS',
        data: data,
        timestamp: '',
      });
      store.loadOneFleetOverview('test');
      store.selectors.fleetOverview$
        .pipe(filter((d) => d.loadingState === 'loaded'))
        .subscribe((res) => {
          expect(res.data).toEqual(data);
        });
    });

    it('error', async () => {
      const { store, fleetOverviewResponse$ } = setup();
      fleetOverviewResponse$.error({ message: 'error' });
      store.loadOneFleetOverview('test');
      store.selectors.fleetOverview$
        .pipe(filter((d) => d.loadingState === 'error'))
        .subscribe((data) => {
          expect(data.message).toBe('error');
        });
    });
  });

  describe('loadDtcGroup', () => {
    it('success', async () => {
      const { store, dtcGroupResponse$ } = setup();
      const data = [
        {
          dtcCode: 'test',
        } as unknown as DtcTemplateGroup,
      ];
      dtcGroupResponse$.next({
        code: 'SUCCESS',
        data: data,
        timestamp: '',
      });
      store.loadDtcGroup('test');
      store.selectors.dtcGroup$
        .pipe(filter((d) => d.loadingState === 'loaded'))
        .subscribe((res) => {
          expect(res.data).toEqual(data);
        });
    });

    it('error', async () => {
      const { store, dtcGroupResponse$ } = setup();
      dtcGroupResponse$.error({ message: 'error' });
      store.loadDtcGroup('test');
      store.selectors.dtcGroup$
        .pipe(filter((d) => d.loadingState === 'error'))
        .subscribe((data) => {
          expect(data.message).toBe('error');
        });
    });
  });

  describe('loadBatteryHealth', () => {
    it('shoud load battery health success', async () => {
      const { store, batteryResponse$ } = setup();
      const data = {
        vin: 'test',
      } as unknown as BatteryStatus;
      batteryResponse$.next({
        code: 'SUCCESS',
        data: data,
        timestamp: '',
      });
      store.loadBatteryHealth('test');
      store.selectors.batteryHealth$
        .pipe(filter((d) => d.loadingState === 'loaded'))
        .subscribe((res) => {
          expect(res.data).toEqual(data);
        });
    });

    it('shoud load battery health with error', async () => {
      const { store, batteryResponse$ } = setup();
      batteryResponse$.error({ message: 'error' });
      store.loadBatteryHealth('test');
      store.selectors.batteryHealth$
        .pipe(filter((d) => d.loadingState === 'error'))
        .subscribe((data) => {
          expect(data.message).toBe('error');
        });
    });
  });

  describe('loadPowertrainAnomaly, get current status', () => {
    it('shoud load powertrain anomaly success', async () => {
      const { store, paResponse$ } = setup();
      const data = {
        vin: 'test',
      } as unknown as PowertrainAnomaly;
      paResponse$.next({
        code: 'SUCCESS',
        data: data,
        timestamp: '',
      });
      store.loadPowertrainAnomaly('test');
      store.selectors.powertrainAnomaly$
        .pipe(filter((d) => d.loadingState === 'loaded'))
        .subscribe((res) => {
          expect(res.data).toEqual(data);
        });
    });

    it('shoud load powertrain anomaly with error', async () => {
      const { store, paResponse$ } = setup();
      paResponse$.error({ message: 'error' });
      store.loadPowertrainAnomaly('test');
      store.selectors.powertrainAnomaly$
        .pipe(filter((d) => d.loadingState === 'error'))
        .subscribe((data) => {
          expect(data.message).toBe('error');
        });
    });
  });

  describe('loadPowertrainAnomalyHistory, get history status', () => {
    it('shoud load powertrain anomaly history success', async () => {
      const { store, paHistoryResponse$ } = setup();
      const data = {
        vin: 'test',
      } as unknown as PowertrainAnomalyHistory;
      paHistoryResponse$.next({
        code: 'SUCCESS',
        data: data,
        timestamp: '',
      });
      store.loadPowertrainAnomalyHistory('test');
      store.selectors.powertrainAnomaly$
        .pipe(filter((d) => d.loadingState === 'loaded'))
        .subscribe((res) => {
          expect(res.data).toEqual(data);
        });
    });

    it('shoud load powertrain anomaly history with error', async () => {
      const { store, paHistoryResponse$ } = setup();
      paHistoryResponse$.error({ message: 'error' });
      store.loadPowertrainAnomalyHistory('test');
      store.selectors.powertrainAnomalyHistory$
        .pipe(filter((d) => d.loadingState === 'error'))
        .subscribe((data) => {
          expect(data.message).toBe('error');
        });
    });
  });
});
