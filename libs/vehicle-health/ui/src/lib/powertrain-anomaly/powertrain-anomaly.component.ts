import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  PowertrainAnomaly,
  RequestStatus
} from '@cps/types';
import { NotAvailableComponent, SkeletonLoadingComponent } from '@cps/ui';
import { PowertrainAnomalyColorPipe } from './powertrain-anomaly-color.pipe';
import { PowertrainAnomalyIconComponent } from './powertrain-anomaly-icon/powertrain-anomaly-icon.component';

@Component({
  selector: 'vh-powertrain-anomaly',
  standalone: true,
  imports: [
    NotAvailableComponent,
    SkeletonLoadingComponent,
    MatIconModule,
    MatTooltipModule,
    PowertrainAnomalyColorPipe,
    PowertrainAnomalyIconComponent,
  ],
  templateUrl: './powertrain-anomaly.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PowertrainAnomalyComponent {
  coolantStatus = null;
  oilStatus = null;

  @Input() set vin(vin: string) {
    this.loadAnomalies.emit(vin);
  }

  @Input() anomalies?: RequestStatus<PowertrainAnomaly | null> = {
    loadingState: 'loading',
  };

  @Output() loadAnomalies = new EventEmitter<string>();
}
