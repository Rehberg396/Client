import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDiagnosticSelectionComponent } from './vehicle-diagnostic-selection.component';

describe('VehicleDiagnosticSelectionComponent', () => {
  let component: VehicleDiagnosticSelectionComponent;
  let fixture: ComponentFixture<VehicleDiagnosticSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDiagnosticSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDiagnosticSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
