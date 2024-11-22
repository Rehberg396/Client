import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vh-expand-icon',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './expand-icon.component.html',
  styleUrl: './expand-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandIconComponent {
  @Input() show = true;
  @Input() expanded = false;
}
