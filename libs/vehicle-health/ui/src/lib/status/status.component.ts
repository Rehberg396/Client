import { Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { StatusLevelColorPipe } from './status-color.pipe';
import { StatusLevelIconPipe } from './status.icon.pipe';
import { StatusLevelCategoryPipe } from './status-category.pipe';

@Component({
  selector: 'vh-status',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    StatusLevelColorPipe,
    StatusLevelIconPipe,
    StatusLevelCategoryPipe,
  ],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss',
})
export class StatusComponent {
  @Input() status = 0;
}
