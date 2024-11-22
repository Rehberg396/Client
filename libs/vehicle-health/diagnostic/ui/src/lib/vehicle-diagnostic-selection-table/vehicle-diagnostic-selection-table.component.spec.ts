import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDiagnosticSelectionTableComponent } from './vehicle-diagnostic-selection-table.component';

describe('VehicleDiagnosticSelectionTableComponent', () => {
  let component: VehicleDiagnosticSelectionTableComponent;
  let fixture: ComponentFixture<VehicleDiagnosticSelectionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDiagnosticSelectionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDiagnosticSelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
