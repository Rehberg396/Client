import {
  ChangeDetectionStrategy,
  Component,
  Input,
  output,
} from '@angular/core';
import { NotAvailableComponent, SkeletonLoadingComponent } from '@cps/ui';
import { RecommendationComponent } from '../recommendation/recommendation.component';
import { Item } from '../vehicle-detail-table/vehicle-detail-table.component';
import { PowertrainAnomalyTableComponent } from '@cps/vehicle-health/ui';

@Component({
  selector: 'vh-expanded-detail',
  standalone: true,
  templateUrl: './expanded-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RecommendationComponent,
    NotAvailableComponent,
    SkeletonLoadingComponent,
    PowertrainAnomalyTableComponent,
  ],
})
export class ExpandedDetailComponent {
  @Input() item?: Item;
  loaded = output<void>();
}
