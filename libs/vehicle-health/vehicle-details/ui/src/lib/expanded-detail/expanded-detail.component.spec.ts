import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedDetailComponent } from './expanded-detail.component';

describe(ExpandedDetailComponent.name, () => {
  let component: ExpandedDetailComponent;
  let fixture: ComponentFixture<ExpandedDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandedDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandedDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
