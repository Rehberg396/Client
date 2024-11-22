import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component';

export type ErrorDialogData = {
  title: string;
  contentMessage: string;
};

@Component({
  selector: 'vh-error-dialog',
  standalone: true,
  imports: [ButtonComponent, MatIconModule, MatButtonModule],
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorDialogComponent {
  data = inject<ErrorDialogData>(DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ErrorDialogComponent>);

  onClose(): void {
    this.dialogRef.close();
  }
}
