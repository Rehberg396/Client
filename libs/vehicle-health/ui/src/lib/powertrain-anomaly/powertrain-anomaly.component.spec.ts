import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotAvailableComponent, SkeletonLoadingComponent } from '@cps/ui';
import { PowertrainAnomalyColorPipe } from './powertrain-anomaly-color.pipe';
import { PowertrainAnomalyIconComponent } from './powertrain-anomaly-icon/powertrain-anomaly-icon.component';
import { PowertrainAnomalyComponent } from './powertrain-anomaly.component';

describe('PowertrainAnomalyComponent', () => {
  let component: PowertrainAnomalyComponent;
  let fixture: ComponentFixture<PowertrainAnomalyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NotAvailableComponent,
        SkeletonLoadingComponent,
        MatIconModule,
        MatTooltipModule,
        PowertrainAnomalyColorPipe,
        PowertrainAnomalyIconComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowertrainAnomalyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit loadAnomalies event when vin is set', () => {
    const mockVin = 'ABC12345';
    const loadAnomaliesSpy = jest.spyOn(component.loadAnomalies, 'emit');

    component.vin = mockVin;

    expect(loadAnomaliesSpy).toHaveBeenCalledWith(mockVin);
  });

  it('should handle loading state', () => {
    component.anomalies = { loadingState: 'loading' };
    fixture.detectChanges();

    const skeletonElement = fixture.nativeElement.querySelector(
      'vh-skeleton-loading'
    );
    expect(skeletonElement).toBeTruthy();
  });
});
