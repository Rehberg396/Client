import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailInfoComponent } from './vehicle-detail-info.component';
import { provideRouter } from '@angular/router';

describe(VehicleDetailInfoComponent.name, () => {
  let component: VehicleDetailInfoComponent;
  let fixture: ComponentFixture<VehicleDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailInfoComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.vehicle = { loadingState: 'loading' };
    component.fleetOverview = { loadingState: 'loading' };
    component.batteryHealth = { loadingState: 'loading' };
    component.powertrainAnomaly = { loadingState: 'loading' };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
