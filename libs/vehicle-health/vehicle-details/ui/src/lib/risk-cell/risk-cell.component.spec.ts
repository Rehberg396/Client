import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCellComponent } from './risk-cell.component';

describe(RiskCellComponent.name, () => {
  let component: RiskCellComponent;
  let fixture: ComponentFixture<RiskCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskCellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
