import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalityComponent } from './criticality.component';

describe(CriticalityComponent.name, () => {
  let component: CriticalityComponent;
  let fixture: ComponentFixture<CriticalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CriticalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
