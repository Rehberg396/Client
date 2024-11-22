import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DtcTemplateGroup } from '@cps/types';
import { NotAvailableComponent } from '@cps/ui';
import { CriticalityComponent, DetailDescriptionItemComponent } from '@cps/vehicle-health/ui';

@Component({
  selector: 'vh-recommendation',
  standalone: true,
  templateUrl: './recommendation.component.html',
  styleUrl: './recommendation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CriticalityComponent,
    DatePipe,
    DetailDescriptionItemComponent,
    NotAvailableComponent,
  ],
})
export class RecommendationComponent {
  @Input() dtcTemplate?: DtcTemplateGroup;
}
