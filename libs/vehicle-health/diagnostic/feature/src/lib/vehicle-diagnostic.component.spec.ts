import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDiagnosticComponent } from './vehicle-diagnostic.component';

describe('VehicleDiagnosticComponent', () => {
  let component: VehicleDiagnosticComponent;
  let fixture: ComponentFixture<VehicleDiagnosticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDiagnosticComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDiagnosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
