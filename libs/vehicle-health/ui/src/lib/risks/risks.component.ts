import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { RiskLevelColorPipe } from './risk-level-color.pipe';
import { RiskLevelCategoryPipe } from './risk-level-category.pipe';

@Component({
  selector: 'vh-risks',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatIconModule,
    RiskLevelColorPipe,
    RiskLevelCategoryPipe,
  ],
  templateUrl: './risks.component.html',
  styleUrl: './risks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RisksComponent {
  @Input() risks?: {
    riskSafetyLevel: number;
    riskDamageLevel: number;
    riskAvailabilityLevel: number;
    riskEmissionsLevel: number;
  };
}
