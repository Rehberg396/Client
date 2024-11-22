import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import {
  BatteryStatus,
  DtcTemplateGroup,
  FleetOverview,
  PowertrainAnomaly,
  PowertrainAnomalyHistory,
  RequestStatus,
  Vehicle,
} from '@cps/types';
import { VH_ENVIRONMENT } from '@cps/vehicle-health/config';
import { VehicleDetailStore } from '@cps/vehicle-health/vehicle-details/data-access';
import { filter, map, ReplaySubject } from 'rxjs';
import { VehicleDetailComponent } from './vehicle-detail.component';

describe(VehicleDetailComponent.name, () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync('noop'),
        {
          provide: VH_ENVIRONMENT,
          useValue: {
            refreshRate: 500,
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const vehicle = new ReplaySubject<RequestStatus<Vehicle>>();
    const fleet = new ReplaySubject<RequestStatus<FleetOverview>>();
    const dtcGroup = new ReplaySubject<RequestStatus<DtcTemplateGroup[]>>();
    const batteryHealth = new ReplaySubject<RequestStatus<BatteryStatus>>();
    const powertrainAnomaly = new ReplaySubject<RequestStatus<PowertrainAnomaly>>();
    const powertrainAnomalyHistory = new ReplaySubject<RequestStatus<PowertrainAnomalyHistory>>();


    const store = {
      loadVehicle: jest.fn(),
      loadOneFleetOverview: jest.fn(),
      setQuery: jest.fn(),
      loadBatteryHealth: jest.fn(),
      loadPowertrainAnomaly: jest.fn(),
      loadDtcGroup: jest.fn(),
      loadPowertrainAnomalyHistory: jest.fn(),
      selectors: {
        vehicle$: vehicle.asObservable(),
        fleetOverview$: fleet.asObservable(),
        dtcGroup$: dtcGroup.asObservable(),
        batteryHealth$: batteryHealth.asObservable(),
        powertrainAnomaly$: powertrainAnomaly.asObservable(),
        powertrainAnomalyHistory$: powertrainAnomalyHistory.asObservable(),
      },
    };

    store.loadVehicle.mockReturnValue(vehicle);
    store.loadOneFleetOverview.mockReturnValue(fleet);
    store.loadBatteryHealth.mockReturnValue(batteryHealth);
    store.loadDtcGroup.mockReturnValue(dtcGroup);
    store.loadPowertrainAnomaly.mockReturnValue(powertrainAnomaly);

    TestBed.overrideProvider(VehicleDetailStore, {
      useValue: store,
    });

    const fixture = TestBed.createComponent(VehicleDetailComponent);
    const component = fixture.componentInstance;

    vehicle.next({
      data: {} as Vehicle,
      loadingState: 'loaded',
    });
    fleet.next({
      data: {} as FleetOverview,
      loadingState: 'loaded',
    });
    batteryHealth.next({
      data: {} as BatteryStatus,
      loadingState: 'loaded',
    });
    powertrainAnomaly.next({
      data: {} as PowertrainAnomaly,
      loadingState: 'loaded',
    });

    powertrainAnomalyHistory.next({
      data: {} as PowertrainAnomalyHistory,
      loadingState: 'loaded',
    });
    dtcGroup.next({
      data: [
        {
          criticality: 'serious',
        } as DtcTemplateGroup,
      ],
      loadingState: 'loaded',
    });
    fixture.componentRef.setInput('vin', 'test');
    fixture.detectChanges();

    return {
      fixture,
      component,
      store,
      vehicle,
      fleet,
      dtcGroup,
      batteryHealth,
      powertrainAnomaly,
      powertrainAnomalyHistory
    };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should load data in paralell', async () => {
    const { component, store } = await setup();
    expect(component.vin()).toBe('test');
    expect(store.loadVehicle).toHaveBeenCalled();
    expect(store.loadOneFleetOverview).toHaveBeenCalled();
    expect(store.loadBatteryHealth).toHaveBeenCalled();
    expect(store.loadPowertrainAnomaly).toHaveBeenCalled();
    expect(store.loadDtcGroup).toHaveBeenCalled();
  });

  describe('onFilterCriticality', () => {
    it('should has size = 2', async () => {
      const { component, dtcGroup } = await setup();
      const data = [
        {
          criticality: 'serious',
        } as DtcTemplateGroup,
        {
          criticality: 'medium',
        } as DtcTemplateGroup,
      ];
      dtcGroup.next({
        loadingState: 'loaded',
        data,
      });
      component.onFilterCriticality('');
      component.vm$
        .pipe(
          map((d) => d.dataSource),
          map((d) => d.dtcGroup),
          filter((d) => d.loadingState === 'loaded'),
          map((d) => d.data)
        )
        .subscribe((actualData) => {
          expect(actualData).toEqual(data);
        });
    });
  });

  it('should call loadPowertrainAnomalyHistory with the correct VIN', async () => {
    const vin = 'test';
    const { component, store} = await setup();
    component.onLoadPowertrainHistory(vin);
    expect(store.loadPowertrainAnomalyHistory).toHaveBeenCalledWith(vin);
  });
});
