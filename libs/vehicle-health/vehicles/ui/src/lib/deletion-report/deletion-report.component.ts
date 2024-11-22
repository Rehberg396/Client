import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@cps/ui';
import jsonToCsvExport from 'json-to-csv-export';

@Component({
  selector: 'vh-deletion-report',
  standalone: true,
  imports: [MatIconModule, ButtonComponent],
  templateUrl: './deletion-report.component.html',
  styleUrl: './deletion-report.component.scss',
})
export class DeletionReportComponent {
  private dialogRef = inject(MatDialogRef<DeletionReportComponent>);

  readonly data = inject<
    {
      vin: string;
      hasError: boolean;
      timestamp: string;
      code: string;
      reason: string;
    }[]
  >(MAT_DIALOG_DATA);

  successes = this.data.filter((d) => !d.hasError);
  errors = this.data.filter((d) => d.hasError);

  download() {
    const data = this.data.map((value) => ({
      Timestamp: value.timestamp,
      VIN: value.vin,
      Status: value.hasError ? 'Error' : 'Success',
      Code: value.code,
      Message: value.reason,
    }));
    jsonToCsvExport({
      data,
      filename: `${new Date().toJSON()}-deletion-report`,
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
