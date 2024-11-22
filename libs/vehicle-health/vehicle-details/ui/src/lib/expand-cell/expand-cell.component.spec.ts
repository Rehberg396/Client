import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandCellComponent } from './expand-cell.component';
import { Item } from '../vehicle-detail-table';

describe(ExpandCellComponent.name, () => {
  let component: ExpandCellComponent;
  let fixture: ComponentFixture<ExpandCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

    it('should return false if item is not loaded', () => {
      const item = {
        status: 'unloaded',
        type: 'powertrain-anomaly',
        data: { coolantStatus: 0, oilStatus: 0 },
      } as unknown as Item;
      expect(component.isHealthy(item)).toBe(false);
    });

    it('should return false if item type is not powertrain-anomaly', () => {
      const item = {
        status: 'loaded',
        type: 'other-type',
        data: { coolantStatus: 0, oilStatus: 0 },
      } as unknown as Item;
      expect(component.isHealthy(item)).toBe(false);
    });
  });
});
