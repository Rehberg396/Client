import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vh-icon-label',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './icon-label.component.html',
  styleUrls: ['./icon-label.component.scss'],
})
export class IconLabelComponent {
  @Input() color: string | undefined = '';
  @Input() icon = '';
  @Input() label = '';
}
