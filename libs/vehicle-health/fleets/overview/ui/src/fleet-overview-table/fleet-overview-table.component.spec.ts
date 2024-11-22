import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FleetOverview } from '@cps/types';
import { FleetOverviewTableComponent } from './fleet-overview-table.component';
import { Sort } from '@angular/material/sort';

describe(FleetOverviewTableComponent.name, () => {
  let component: FleetOverviewTableComponent;
  let fixture: ComponentFixture<FleetOverviewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetOverviewTableComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(FleetOverviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when criticalityLevel !== 6', () => {
    const data = { criticalityLevel: 1 } as FleetOverview;
    const result = component.hasCriticality(data);
    expect(result).toBe(true);
  });

  it('should return false when criticalityLevel === 6', () => {
    const data = { criticalityLevel: 6 } as FleetOverview;
    const result = component.hasCriticality(data);
    expect(result).toBe(false);
  });

  it('should emit loadBatteryHealth event when onLoadBattery is called', () => {
    const mockVin = 'ABC12345';
    const loadBatteryHealthSpy = jest.spyOn(component.loadBatteryHealth, 'emit');

    component.onLoadBattery(mockVin);

    expect(loadBatteryHealthSpy).toHaveBeenCalledWith(mockVin);
  });

  it('should emit loadAnomalies event when onLoadAnomalies is called', () => {
    const mockVin = 'ABC12345';
    const loadAnomaliesSpy = jest.spyOn(component.loadAnomalies, 'emit');

    component.onLoadAnomalies(mockVin);

    expect(loadAnomaliesSpy).toHaveBeenCalledWith(mockVin);
  });

  it('should emit sort event when updateSortChange is called', () => {
    const mockSort: Sort = {
      active: 'licensePlate',
      direction: 'asc',
    };
    const sortSpy = jest.spyOn(component.sort, 'emit');

    component.updateSortChange(mockSort);

    expect(sortSpy).toHaveBeenCalledWith(mockSort);
  });
});
