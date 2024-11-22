import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDiagnosticTableComponent } from './vehicle-diagnostic-table.component';

describe('VehicleDiagnosticTableComponent', () => {
  let component: VehicleDiagnosticTableComponent;
  let fixture: ComponentFixture<VehicleDiagnosticTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDiagnosticTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDiagnosticTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
