import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';
import { ErrorDialogComponent } from './error-dialog.component';

describe(ErrorDialogComponent.name, () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  const matDialogRefMock = {
    close: jest.fn(),
  };
  const inputDialogMock = {
    title: 'test title',
    contentMessage: 'test message',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ErrorDialogComponent,
        ButtonComponent,
        MatIconModule,
        MatButtonModule,
      ],
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

    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct data', () => {
    expect(component.data).toEqual(inputDialogMock);
  });

  it('should call close on onClose', () => {
    component.onClose();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
});
