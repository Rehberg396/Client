import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type CircleColor =
  | 'success'
  | 'warning'
  | 'error'
  | 'offline'
  | 'serious'
  | 'high'
  | 'medium'
  | 'low'
  | 'none';

@Component({
  selector: 'vh-circle',
  standalone: true,
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleComponent {
  @Input() color?: CircleColor;
}
