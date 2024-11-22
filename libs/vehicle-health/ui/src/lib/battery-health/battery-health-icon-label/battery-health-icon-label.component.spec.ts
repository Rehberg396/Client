import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BatteryHealthIconLabelComponent } from './battery-health-icon-label.component';

describe('BatteryHealthIconLabelComponent', () => {
  let component: BatteryHealthIconLabelComponent;
  let fixture: ComponentFixture<BatteryHealthIconLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatteryHealthIconLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BatteryHealthIconLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
