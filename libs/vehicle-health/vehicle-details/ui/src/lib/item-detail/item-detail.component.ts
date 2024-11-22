import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SkeletonLoadingComponent } from '@cps/ui';
import { Item } from '../vehicle-detail-table/vehicle-detail-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'vh-item-detail',
  standalone: true,
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, SkeletonLoadingComponent, MatProgressSpinnerModule],
})
export class ItemDetailComponent {
  @Input() item?: Item;
}
