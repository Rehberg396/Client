import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDiagnosticSelectionFormComponent } from './vehicle-diagnostic-selection-form.component';

describe('VehicleDiagnosticSelectionFormComponent', () => {
  let component: VehicleDiagnosticSelectionFormComponent;
  let fixture: ComponentFixture<VehicleDiagnosticSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDiagnosticSelectionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDiagnosticSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
