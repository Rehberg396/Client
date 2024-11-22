import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  signal,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogData } from './confirm-dialog.model';

@Component({
  selector: 'vh-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ButtonComponent, MatIconModule, MatProgressSpinnerModule],
})
export class ConfirmDialogComponent {
  @Input()
  isShowClose = true;

  @Input()
  isLoading = signal(false);

  @Input()
  onClickConfirm?: () => void;

  constructor(
    private _dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm() {
    if (this.onClickConfirm) {
      this.onClickConfirm();
    } else {
      this._dialogRef.close(true);
    }
  }

  onClose() {
    this._dialogRef.close(false);
  }
}
