import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FleetOverviewDetailComponent } from './fleet-overview-detail.component';

describe(FleetOverviewDetailComponent.name, () => {
  let component: FleetOverviewDetailComponent;
  let fixture: ComponentFixture<FleetOverviewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetOverviewDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FleetOverviewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
