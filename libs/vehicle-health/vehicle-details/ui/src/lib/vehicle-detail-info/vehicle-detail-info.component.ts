import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  BatteryStatus,
  FleetOverview,
  PowertrainAnomaly,
  RequestStatus,
  Vehicle,
} from '@cps/types';
import {
  CircleComponent,
  NotAvailableComponent,
  OdometerToKmPipe,
  SkeletonLoadingComponent,
} from '@cps/ui';
import {
  BatteryHealthComponent,
  CriticalityComponent,
  CurrentStatusComponent,
  RisksComponent,
  PowertrainAnomalyComponent,
  DividerComponent
} from '@cps/vehicle-health/ui';

import { VehicleItemComponent } from '@cps/vehicle-health/ui';

@Component({
  selector: 'vh-vehicle-detail-info',
  standalone: true,
  templateUrl: './vehicle-detail-info.component.html',
  styleUrls: ['./vehicle-detail-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatChipsModule,
    CircleComponent,
    AsyncPipe,
    DatePipe,
    MatTooltipModule,
    RouterLink,
    MatTooltipModule,
    OdometerToKmPipe,
    VehicleItemComponent,
    NotAvailableComponent,
    CriticalityComponent,
    CurrentStatusComponent,
    RisksComponent,
    BatteryHealthComponent,
    SkeletonLoadingComponent,
    PowertrainAnomalyComponent,
    DividerComponent,
],
})
export class VehicleDetailInfoComponent {
  @Input() vehicle: RequestStatus<Vehicle> = {
    loadingState: 'loading',
  };

  @Input() fleetOverview: RequestStatus<FleetOverview> = {
    loadingState: 'loading',
  };

  @Input() batteryHealth: RequestStatus<BatteryStatus> = {
    loadingState: 'loading',
  };

  @Input() powertrainAnomaly: RequestStatus<PowertrainAnomaly> = {
    loadingState: 'loading',
  };
}
