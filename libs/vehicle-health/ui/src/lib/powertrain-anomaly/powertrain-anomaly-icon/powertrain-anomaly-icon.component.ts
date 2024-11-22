import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { IconLabelComponent } from '@cps/ui';
import { PowertrainAnomalyColorPipe } from '../powertrain-anomaly-color.pipe';
import { PowertrainAnomalyStatusPipe } from '../powertrain-anomaly-status.pipe';

@Component({
  selector: 'vh-powertrain-anomaly-icon',
  standalone: true,
  templateUrl: './powertrain-anomaly-icon.component.html',
  styleUrls: ['./powertrain-anomaly-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    PowertrainAnomalyColorPipe,
    IconLabelComponent,
    MatTooltip,
    PowertrainAnomalyStatusPipe,
  ],
})
export class PowertrainAnomalyIconComponent {
  @Input() coolantStatus: number | null = 0;
  @Input() oilStatus: number | null = 0;
  @Input() type: 'vertical' | 'horizontal' = 'horizontal';
}
