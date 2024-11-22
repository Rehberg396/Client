import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SkeletonLoadingComponent } from '@cps/ui';

@Component({
  selector: 'vh-vehicle-item',
  standalone: true,
  imports: [SkeletonLoadingComponent, MatChipsModule],
  templateUrl: './vehicle-item.component.html',
  styleUrl: './vehicle-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleItemComponent {
  @Input() isImportant = false;
  @Input() isLoading = false;
}
