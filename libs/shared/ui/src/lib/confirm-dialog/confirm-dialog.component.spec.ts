import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '../button/button.component';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe(ConfirmDialogComponent.name, () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const matDialogRefMock = {
    close: jest.fn(),
  };
  const inputDialogMock = {
    title: 'test title',
    contentMessage: 'test message',
    contentTitle: 'test title',
    leftButtonText: 'test button left',
    rightButtonText: 'test button right',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent, ButtonComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogRefMock,
        },
        {
          provide: DIALOG_DATA,
          useValue: inputDialogMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct input data to UI', () => {
    const title = fixture.debugElement.query(
      By.css('.confirm-dialog__wrapper .confirm-dialog-title')
    ).nativeElement.innerHTML;
    const message = fixture.debugElement.query(
      By.css('.confirm-dialog__wrapper .confirm-dialog__content-message')
    ).nativeElement.innerHTML;
    const leftButtonText = fixture.debugElement.query(
      By.css('.confirm-dialog__wrapper .left-button')
    ).nativeElement.textContent;
    const rightButtonText = fixture.debugElement.query(
      By.css('.confirm-dialog__wrapper .right-button')
    ).nativeElement.textContent;

    expect(title).toBe('test title');
    expect(message).toBe(' test message ');
    expect(leftButtonText).toBe(' test button left ');
    expect(rightButtonText).toBe(' test button right ');
  });

  it('should close with true when left button is trigger', () => {
    const leftButtonText = fixture.debugElement.query(
      By.css('.confirm-dialog__wrapper .left-button')
    ).nativeElement;
    leftButtonText.click();
    expect(matDialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close with false when right button is trigger', () => {
    const leftButtonText = fixture.debugElement.query(
      By.css('.confirm-dialog__wrapper .right-button')
    ).nativeElement;
    leftButtonText.click();
    expect(matDialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('shoud call onClickConfirm when it is declared when onConfirm is triggered', () => {
    component.onClickConfirm = jest.fn();
    component.onConfirm();
    expect(component.onClickConfirm).toHaveBeenCalled();
  });
});
