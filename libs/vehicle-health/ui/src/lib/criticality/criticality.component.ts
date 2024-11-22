import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CriticalityPipe } from './criticality.pipe';

@Component({
  selector: 'vh-criticality',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, CriticalityPipe],
  templateUrl: './criticality.component.html',
  styleUrl: './criticality.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriticalityComponent {
  value = input<string | undefined>();
  criticality = computed(() => this.value() ?? 'No criticality');
}
