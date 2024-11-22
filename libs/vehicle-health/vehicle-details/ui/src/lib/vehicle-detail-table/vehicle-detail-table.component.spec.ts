import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DtcTemplateGroup } from '@cps/types';
import {
  Item,
  VehicleDetailTableComponent,
} from './vehicle-detail-table.component';

describe(VehicleDetailTableComponent.name, () => {
  let component: VehicleDetailTableComponent;
  let fixture: ComponentFixture<VehicleDetailTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VehicleDetailTableComponent,
        BrowserAnimationsModule,
        MatMenuModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set battery health, set powertrain anomaly, set powertrain anomaly history and dtc template with loading status to dataSource when loading state is initial', () => {
    component.dataSource = {
      batteryHealth: {
        loadingState: 'initial',
      },
      powertrainAnomaly: {
        loadingState: 'initial',
      },
      powertrainAnomalyHistory: {
        loadingState: 'initial',
      },
      dtcGroup: {
        loadingState: 'initial',
      },
    };
    fixture.detectChanges();

    const expected: Item[] = [
      {
        type: 'battery',
        status: 'loading',
        isUpdating: false,
      },
      {
        type: 'powertrain-anomaly',
        status: 'loading',
        isUpdating: false,
      },
      {
        type: 'dtcTemplate',
        status: 'loading',
        isUpdating: false,
      },
    ];

    expect(component.dataSource).toEqual(expected);
  });

  it('should set battery health, set powertrain anomaly, set powertrain anomaly history and dtc template with loading status to dataSource when loading state is loading', () => {
    component.dataSource = {
      batteryHealth: {
        loadingState: 'loading',
      },
      powertrainAnomalyHistory: {
        loadingState: 'loading',
      },
      powertrainAnomaly: {
        loadingState: 'loading',
      },
      dtcGroup: {
        loadingState: 'loading',
      },
    };
    fixture.detectChanges();

    const expected: Item[] = [
      {
        type: 'battery',
        status: 'loading',
        isUpdating: false,
      },
      {
        type: 'powertrain-anomaly',
        status: 'loading',
        isUpdating: false,
      },
      {
        type: 'dtcTemplate',
        status: 'loading',
        isUpdating: false,
      },
    ];

    expect(component.dataSource).toEqual(expected);
  });

  it('should set battery health, set powertrain anomaly, set powertrain anomaly history and dtc template with error status to dataSource when loading state is error', () => {
    component.dataSource = {
      batteryHealth: {
        loadingState: 'error',
        message: 'an error message',
      },
      powertrainAnomaly: {
        loadingState: 'error',
        message: 'an error message',
      },
      dtcGroup: {
        loadingState: 'error',
        message: 'an error message',
      },
      powertrainAnomalyHistory: {
        loadingState: 'error',
        message: 'an error message',
      },
    };
    fixture.detectChanges();

    expect(component.dataSource).toEqual([]);
  });

  it('should set battery health, set powertrain anomaly, set powertrain anomaly history and dtc template with loaded status to dataSource when loading state is loaded', () => {
    const dtc = {
      dtcCategoryGroup: 'Aftertreatment System',
      recommendations: ['r1', 'r2'],
    } as unknown as DtcTemplateGroup;

    component.dataSource = {
      batteryHealth: {
        loadingState: 'loaded',
        data: {
          category: 'category',
          recommendation: 'recommendation',
          sohStatus: 1,
          sohValue: 1,
          timestamp: 'timestamp',
          vin: 'test',
        },
      },
      powertrainAnomaly: {
        loadingState: 'loaded',
        data: {
          coolantStatus: 0,
          oilStatus: 0,
          coolantTimestamp: '',
          oilTimestamp: '',
          vin: '',
        },
      },
      powertrainAnomalyHistory: {
        loadingState: 'loaded',
        data: {
          oilHistories: [],
          coolantHistories: [],
        },
      },
      dtcGroup: {
        loadingState: 'loaded',
        data: [dtc],
      },
    };
    fixture.detectChanges();

    const expected: Item[] = [
      {
        type: 'battery',
        status: 'loaded',
        title: 'Starter Battery Health',
        icon: 'bosch-ic-battery-car-charging',
        descriptions: ['recommendation'],
        data: {
          category: 'category',
          recommendation: 'recommendation',
          sohStatus: 1,
          sohValue: 1,
          timestamp: 'timestamp',
          vin: 'test',
        },
        isUpdating: false,
      },
      {
        type: 'powertrain-anomaly',
        status: 'loaded',
        title: 'Powertrain Anomaly',
        icon: 'bosch-ic-wrench',
        descriptions: [
          'Normal Coolant Temperature detected',
          'Normal Oil Temperature detected',
        ],
        data: {
          coolantStatus: 0,
          oilStatus: 0,
          coolantTimestamp: '',
          oilTimestamp: '',
          vin: '',
          history: {
            data: {
              coolantHistories: [],
              oilHistories: [],
            },
            loadingState: 'loaded',
          },
        },
        isUpdating: false,
      },
      {
        type: 'dtcTemplate',
        descriptions: dtc.recommendations,
        icon: 'bosch-ic-car-mechanic',
        status: 'loaded',
        title: dtc.dtcCategoryGroup,
        data: dtc,
        isUpdating: false,
      },
    ];

    expect(component.dataSource).toEqual(expected);
  });

  it('onFilterCriticality', () => {
    jest.spyOn(component.filterCriticality, 'emit');
    component.onFilterCriticality('test');
    expect(component.filterCriticality.emit).toHaveBeenCalledWith('test');
  });

  describe('isHealthy', () => {
    it('should return true if coolantStatus and oilStatus are both 0', () => {
      const item = {
        status: 'loaded',
        type: 'powertrain-anomaly',
        data: { coolantStatus: 0, oilStatus: 0 },
      } as unknown as Item;
      expect(component.isHealthy(item)).toBe(true);
    });

    it('should return true if coolantStatus is 0 and oilStatus is null', () => {
      const item = {
        status: 'loaded',
        type: 'powertrain-anomaly',
        data: { coolantStatus: 0, oilStatus: null },
      } as unknown as Item;
      expect(component.isHealthy(item)).toBe(true);
    });

    it('should return true if coolantStatus is null and oilStatus is 0', () => {
      const item = {
        status: 'loaded',
        type: 'powertrain-anomaly',
        data: { coolantStatus: null, oilStatus: 0 },
      } as unknown as Item;
      expect(component.isHealthy(item)).toBe(true);
    });

    it('should return true if coolantStatus and oilStatus are both null', () => {
      const item = {
        status: 'loaded',
        type: 'powertrain-anomaly',
        data: { coolantStatus: null, oilStatus: null },
      } as unknown as Item;
      expect(component.isHealthy(item)).toBe(true);
    });
  });
});
