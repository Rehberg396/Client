import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowertrainAnomalyIconComponent } from './powertrain-anomaly-icon.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PowertrainAnomalyColorPipe } from '../powertrain-anomaly-color.pipe';
import { IconLabelComponent } from '@cps/ui';
import { MatTooltip } from '@angular/material/tooltip';

describe('PowertrainAnomalyIconComponent', () => {
  let component: PowertrainAnomalyIconComponent;
  let fixture: ComponentFixture<PowertrainAnomalyIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatIconModule,
        PowertrainAnomalyColorPipe,
        IconLabelComponent,
        MatTooltip,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowertrainAnomalyIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
