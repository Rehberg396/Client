import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterDialogComponent } from './filter-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe(FilterDialogComponent.name, () => {
  let component: FilterDialogComponent;
  let fixture: ComponentFixture<FilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            filterOption: [],
          },
        },
        {
          provide: MatDialogRef<unknown>,
          useValue: {
            close: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
