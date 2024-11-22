import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Vehicle } from '@cps/types';

@Component({
  selector: 'vh-vehicle-image',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-image.component.html',
  styleUrl: './vehicle-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleImageComponent {
  imageUrl = '';
  errorCount = 0;

  @Input() imageWidth?: string | number;
  @Input() imageHeight?: string | number;
  @Input() imageMaxWidth?: string | number;

  @Input() set vehicle(vehicle: Partial<Vehicle> | undefined) {
    const thumbnail = vehicle?.vehicleProperties?.find(
      (property) => property.name === 'thumbnail'
    )?.value;

    if (typeof thumbnail === 'string') {
      this.imageUrl = thumbnail;
    }
  }

  onError(error: ErrorEvent) {
    if (this.errorCount > 0) {
      return;
    }
    const target = error.target;
    if (target && 'src' in target) {
      target.src = 'img/mock-pkw.png';
      this.errorCount++;
    }
  }
}
