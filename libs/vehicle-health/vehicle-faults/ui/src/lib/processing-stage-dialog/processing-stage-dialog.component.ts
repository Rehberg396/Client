import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { VehicleFaultHistory } from '@cps/types';
import { ButtonComponent } from '@cps/ui';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'vh-processing-stage-dialog',
  standalone: true,
  templateUrl: './processing-stage-dialog.component.html',
  styleUrl: './processing-stage-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatStepperModule,
    MatIconModule,
    ButtonComponent,
    ScrollingModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ProcessingStageDialogComponent {
  dialogRef = inject(MatDialogRef<ProcessingStageDialogComponent>);
  data = inject<Observable<VehicleFaultHistory>>(DIALOG_DATA);
  processingStages$ = this.data.pipe(
    map((history) => ({
      progessingStages: history.histories.map((fault) => ({
        dateTime: fault.faultDateTime,
        state: fault.status,
      })),
      isLoading: history.loading,
    })),
    map((value) => {
      const group = value.progessingStages.reduce(
        (previousValue, currentValue) => {
          if (!previousValue[currentValue.state]) {
            previousValue[currentValue.state] = [];
          }
          previousValue[currentValue.state].push(currentValue.dateTime);
          return previousValue;
        },
        {} as Record<string, string[]>
      );
      return {
        isLoading: value.isLoading,
        entries: Object.entries(group).map(([label, content]) => ({
          label,
          content,
        })),
      };
    })
  );
  close() {
    this.dialogRef.close();
  }
}
