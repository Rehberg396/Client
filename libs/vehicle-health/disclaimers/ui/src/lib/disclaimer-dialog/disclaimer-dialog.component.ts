import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@cps/ui';
import { DisclaimerContentComponent } from '../disclaimer-content/disclaimer-content.component';

@Component({
  selector: 'vh-disclaimer-dialog',
  standalone: true,
  imports: [
    DisclaimerContentComponent,
    MatCheckboxModule,
    ButtonComponent,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './disclaimer-dialog.component.html',
  styleUrls: ['./disclaimer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclaimerDialogComponent {
  dialogRef = inject(MatDialogRef<DisclaimerDialogComponent>);

  formControl = new FormControl(false);

  accept() {
    this.dialogRef.close(this.formControl.value);
  }
}
