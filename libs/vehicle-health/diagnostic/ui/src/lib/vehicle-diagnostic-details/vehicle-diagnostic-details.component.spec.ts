import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDiagnosticDetailsComponent } from './vehicle-diagnostic-details.component';

describe('VehicleDiagnosticDetailsComponent', () => {
  let component: VehicleDiagnosticDetailsComponent;
  let fixture: ComponentFixture<VehicleDiagnosticDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDiagnosticDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDiagnosticDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
