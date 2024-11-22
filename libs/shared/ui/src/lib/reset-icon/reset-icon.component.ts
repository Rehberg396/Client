import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'vh-reset-icon',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './reset-icon.component.html',
  styleUrl: './reset-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetIconComponent {
  @Input() show = true;
}
