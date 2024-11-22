import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IconLabelComponent, SkeletonLoadingComponent } from '@cps/ui';
import {
  BatteryHealthIconLabelComponent,
  PowertrainAnomalyIconComponent,
  RisksComponent,
} from '@cps/vehicle-health/ui';
import { Item } from '../vehicle-detail-table/vehicle-detail-table.component';

@Component({
  selector: 'vh-risk-cell',
  standalone: true,
  templateUrl: './risk-cell.component.html',
  styleUrl: './risk-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconLabelComponent,
    RisksComponent,
    SkeletonLoadingComponent,
    BatteryHealthIconLabelComponent,
    PowertrainAnomalyIconComponent,
  ],
})
export class RiskCellComponent {
  @Input() item?: Item;
}
