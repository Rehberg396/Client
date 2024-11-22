import { Provider } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DisclaimerDialogComponent } from './disclaimer-dialog.component';

describe('DisclaimerDialogComponent', () => {
  let component: DisclaimerDialogComponent;
  let fixture: ComponentFixture<DisclaimerDialogComponent>;

  const dialogRef = {
    close: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisclaimerDialogComponent, ReactiveFormsModule],
      providers: [
        {
          provide: MatDialogRef<DisclaimerDialogComponent>,
          useValue: dialogRef,
        } as Provider,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DisclaimerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close() with true value when form control value is true', () => {
    component.formControl.setValue(true);
    component.accept();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call dialogRef.close() with false value when form control value is false', () => {
    component.formControl.setValue(false);
    component.accept();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
