import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalitySelectComponent } from './criticality-select.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe(CriticalitySelectComponent.name, () => {
  let component: CriticalitySelectComponent;
  let fixture: ComponentFixture<CriticalitySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalitySelectComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CriticalitySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
