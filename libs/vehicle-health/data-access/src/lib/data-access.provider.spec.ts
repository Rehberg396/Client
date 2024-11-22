import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideApiServices } from './data-access.provider';
import { DtcCategoryGroupService } from './services/dtc-category-group.service';
import {
  BatteryHealthService,
  DtcTemplateService,
  FleetService,
  PowertrainAnomalyService,
  VehicleService,
} from './services';
import { ContactService } from './services/contact.service';

describe(provideApiServices.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideApiServices({
          vh: 'https://vh.domain',
          sm: 'https://sm.domain',
        }),
        provideHttpClient(),
      ],
    });
  });

  it('should contain DtcCategoryGroupService', () => {
    expect(TestBed.inject(DtcCategoryGroupService)).toBeTruthy();
  });

  it('should contain DtcTemplateService', () => {
    expect(TestBed.inject(DtcTemplateService)).toBeTruthy();
  });

  it('should contain VehicleService', () => {
    expect(TestBed.inject(VehicleService)).toBeTruthy();
  });

  it('should contain FleetService', () => {
    expect(TestBed.inject(FleetService)).toBeTruthy();
  });

  it('should contain BatteryHealthService', () => {
    expect(TestBed.inject(BatteryHealthService)).toBeTruthy();
  });

  it('should contain ContactService', () => {
    expect(TestBed.inject(ContactService)).toBeTruthy();
  });

  it('should contain PowertrainAnomalyService', () => {
    expect(TestBed.inject(PowertrainAnomalyService)).toBeTruthy();
  });
});
