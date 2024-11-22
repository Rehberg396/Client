import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletionReportComponent } from './deletion-report.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsonToCsvExport from 'json-to-csv-export';

jest.mock('json-to-csv-export', () => {
  return {
    default: jest.fn(),
  };
});

describe(DeletionReportComponent.name, () => {
  let component: DeletionReportComponent;
  let fixture: ComponentFixture<DeletionReportComponent>;
  const dialogRef = {
    close: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletionReportComponent],
      providers: [
        {
          provide: MatDialogRef<DeletionReportComponent>,
          useValue: dialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: [
            {
              vin: 'vin1',
              hasError: false,
              timestamp: '2024-01-01T00:00Z',
              code: 'SUCCESS',
              reason: '',
            },
            {
              vin: 'vin2',
              hasError: true,
              timestamp: '2024-01-01T00:00Z',
              code: 'ERROR',
              reason: 'failed',
            },
          ],
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    component.onClose();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should download csv', () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-10-22T02:26:27.894Z'));
    component.download();
    expect(jsonToCsvExport).toHaveBeenCalledWith({
      data: [
        {
          Code: 'SUCCESS',
          Message: '',
          Status: 'Success',
          Timestamp: '2024-01-01T00:00Z',
          VIN: 'vin1',
        },
        {
          Code: 'ERROR',
          Message: 'failed',
          Status: 'Error',
          Timestamp: '2024-01-01T00:00Z',
          VIN: 'vin2',
        },
      ],
      filename: '2024-10-22T02:26:27.894Z-deletion-report',
    });
  });
});
