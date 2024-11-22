import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalityCellComponent } from './criticality-cell.component';

describe(CriticalityCellComponent.name, () => {
  let component: CriticalityCellComponent;
  let fixture: ComponentFixture<CriticalityCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriticalityCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CriticalityCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
