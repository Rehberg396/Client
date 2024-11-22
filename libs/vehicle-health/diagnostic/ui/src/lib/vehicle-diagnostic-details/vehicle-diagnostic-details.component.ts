import {
  ChangeDetectionStrategy,
  Component,
  Input,
 } from '@angular/core';
 import { CommonModule } from '@angular/common';
import { DiagnosticStep } from '@cps/types';
import { DetailDescriptionItemComponent } from '@cps/vehicle-health/ui';

@Component({
  selector: 'vh-vehicle-diagnostic-details',
  standalone: true,
  templateUrl: './vehicle-diagnostic-details.component.html',
  styleUrl: './vehicle-diagnostic-details.component.scss',
  imports: [
    CommonModule,
    DetailDescriptionItemComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDiagnosticDetailsComponent {
  @Input() dataSource?: DiagnosticStep;
}
