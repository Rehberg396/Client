import {
  ChangeDetectionStrategy,
  Component,
  Input,
  LOCALE_ID,
  inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FleetOverview } from '@cps/types';
import { DistanceToNowPipe } from '@cps/ui';

@Component({
  selector: 'vh-fleet-overview-detail',
  standalone: true,
  imports: [MatIconModule, DistanceToNowPipe],
  templateUrl: './fleet-overview-detail.component.html',
  styleUrls: ['./fleet-overview-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetOverviewDetailComponent {
  locale = inject(LOCALE_ID);

  @Input() data: FleetOverview | null = null;
}
