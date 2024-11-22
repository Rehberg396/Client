import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DisclaimerContentComponent } from '@cps/vehicle-health/disclaimers/ui';

@Component({
  selector: 'vh-disclaimer',
  standalone: true,
  imports: [DisclaimerContentComponent],
  styleUrls: ['./disclaimer.component.scss'],
  templateUrl: './disclaimer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisclaimerComponent {}
