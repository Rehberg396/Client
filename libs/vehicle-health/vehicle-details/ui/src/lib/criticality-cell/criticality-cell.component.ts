import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Item } from '../vehicle-detail-table/vehicle-detail-table.component';
import { CriticalityComponent } from '@cps/vehicle-health/ui';
import { SkeletonLoadingComponent } from '@cps/ui';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vh-criticality-cell',
  standalone: true,
  styleUrl: './criticality-cell.component.scss',
  templateUrl: './criticality-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CriticalityComponent, SkeletonLoadingComponent, DatePipe],
})
export class CriticalityCellComponent {
  @Input() item?: Item;
}
