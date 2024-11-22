import { Component, Input } from '@angular/core';
import { NotAvailableComponent } from '@cps/ui';

@Component({
  selector: 'vh-detail-description-item',
  standalone: true,
  imports: [NotAvailableComponent],
  templateUrl: './detail-description-item.component.html',
  styleUrl: './detail-description-item.component.scss',
})
export class DetailDescriptionItemComponent {
  @Input() title?: string;
}
