import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BatteryStatus, RequestStatus } from '@cps/types';
import { NotAvailableComponent, SkeletonLoadingComponent } from '@cps/ui';
import { BatteryColorPipe } from './battery-color.pipe';

@Component({
  selector: 'vh-battery-health',
  standalone: true,
  imports: [
    NotAvailableComponent,
    SkeletonLoadingComponent,
    MatIconModule,
    MatTooltipModule,
    BatteryColorPipe,
  ],
  templateUrl: './battery-health.component.html',
  styleUrls: ['./battery-health.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatteryHealthComponent {
  @Input() set vin(vin: string) {
    this.loadBattery.emit(vin);
  }

  @Input() batteryHealth?: RequestStatus<BatteryStatus | null> = {
    loadingState: 'loading',
  };

  @Output() loadBattery = new EventEmitter<string>();
}
