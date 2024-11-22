import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingStageDialogComponent } from './processing-stage-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { VehicleFault, VehicleFaultHistory } from '@cps/types';

describe(ProcessingStageDialogComponent.name, () => {
  let component: ProcessingStageDialogComponent;
  let fixture: ComponentFixture<ProcessingStageDialogComponent>;

  const matDialogRefMock = {
    close: jest.fn(),
  };

  const histories: VehicleFaultHistory = {
    histories: [
      {
        status: 'inactive',
        end: new Date().toJSON(),
        faultDateTime: new Date().toJSON(),
      } as VehicleFault,
      {
        status: 'confirmed',
        faultDateTime: new Date().toJSON(),
      } as VehicleFault,
    ],
    loading: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingStageDialogComponent, NoopAnimationsModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: matDialogRefMock,
        },
        {
          provide: DIALOG_DATA,
          useValue: of(histories),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessingStageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    component.close();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
});
