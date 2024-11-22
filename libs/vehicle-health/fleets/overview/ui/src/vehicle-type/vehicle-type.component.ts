import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'vh-vehicle-type',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTypeComponent {
  @Input() manufacturerName = '';
  @Input() modelLine = '';
}
