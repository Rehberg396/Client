import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CircleComponent } from '@cps/ui';
import { CurrentStatusPipe } from './current-status.pipe';

@Component({
  selector: 'vh-current-status',
  standalone: true,
  imports: [MatTooltipModule, DatePipe, CircleComponent, CurrentStatusPipe],
  templateUrl: './current-status.component.html',
  styleUrl: './current-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentStatusComponent {
  @Input() status?: string = 'Offline';
  @Input() timestamp?: string | Date;
}
