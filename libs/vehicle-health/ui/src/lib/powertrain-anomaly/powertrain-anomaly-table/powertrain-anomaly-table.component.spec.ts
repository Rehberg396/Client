import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { IconLabelComponent, SkeletonLoadingComponent } from '@cps/ui';
import { PowertrainAnomalyColorPipe } from '../powertrain-anomaly-color.pipe';
import { PowertrainAnomalyStatusPipe } from '../powertrain-anomaly-status.pipe';
import { PowertrainAnomalyTableComponent } from './powertrain-anomaly-table.component';

describe('PowertrainAnomalyTableComponent', () => {
  let component: PowertrainAnomalyTableComponent;
  let fixture: ComponentFixture<PowertrainAnomalyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatIconModule,
        PowertrainAnomalyColorPipe,
        PowertrainAnomalyStatusPipe,
        IconLabelComponent,
        SkeletonLoadingComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowertrainAnomalyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
});
