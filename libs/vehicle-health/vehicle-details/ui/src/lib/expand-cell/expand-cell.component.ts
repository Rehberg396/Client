import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ExpandIconComponent } from '@cps/ui';
import { Item } from '../vehicle-detail-table/vehicle-detail-table.component';

@Component({
  selector: 'vh-expand-cell',
  standalone: true,
  templateUrl: './expand-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ExpandIconComponent],
})
export class ExpandCellComponent {
  @Input() item?: Item;
  @Input() expanded = false;
  @Output() toggle = new EventEmitter<MouseEvent>();

  isHealthy(item: Item) {
    if (item.status === 'loaded' && item.type === 'powertrain-anomaly') {
      const { coolantStatus, oilStatus } = item.data;
  
      return (coolantStatus === 0 && oilStatus === 0) ||
             (coolantStatus === 0 && oilStatus === null) ||
             (coolantStatus === null && oilStatus === 0) ||
             (coolantStatus === null && oilStatus === null);
    }
    return false;
  }
}
