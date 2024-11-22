import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatteryHealthComponent } from './battery-health.component';
import { By } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';
import { NotAvailableComponent, SkeletonLoadingComponent } from '@cps/ui';

describe(BatteryHealthComponent.name, () => {
  let component: BatteryHealthComponent;
  let fixture: ComponentFixture<BatteryHealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatteryHealthComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BatteryHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display skeleton loading', () => {
    fixture.componentRef.setInput('batteryHealth', {
      loadingState: 'loading',
    });
    fixture.detectChanges();
    const el = fixture.debugElement.query(
      By.directive(SkeletonLoadingComponent)
    );
    expect(el).toBeTruthy();
  });

  it('should display battery health icon', () => {
    fixture.componentRef.setInput('batteryHealth', {
      loadingState: 'loaded',
      data: {
        category: 'Good',
        sohStatus: 1,
        recommendation: 'Test',
        sohValue: 1,
        timestamp: new Date().toISOString(),
        vin: 'test',
      },
    });
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.directive(MatIcon));
    expect(el).toBeTruthy();
  });

  it('should display not available', () => {
    fixture.componentRef.setInput('batteryHealth', {
      loadingState: 'error',
    });
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.directive(NotAvailableComponent));
    expect(el).toBeTruthy();
  });

  it('should call loadBattery.emit() when vin @Input changes', () => {
    jest.spyOn(component.loadBattery, 'emit');
    component.vin = 'test';
    expect(component.loadBattery.emit).toHaveBeenCalledWith('test');
  });
});
