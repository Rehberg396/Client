import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { OverlayModule } from '@angular/cdk/overlay';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  BatteryStatus,
  FleetOverview,
  PowertrainAnomaly,
  RequestStatus,
} from '@cps/types';
import {
  ExpandIconComponent,
  NotAvailableComponent,
  SkeletonLoadingComponent,
} from '@cps/ui';
import {
  BatteryHealthComponent,
  CriticalityComponent,
  CurrentStatusComponent,
  PowertrainAnomalyComponent,
  RisksComponent,
  VehicleImageComponent,
} from '@cps/vehicle-health/ui';
import { FleetOverviewDetailComponent } from '../fleet-overview-detail/fleet-overview-detail.component';
import { VehicleTypeComponent } from '../vehicle-type/vehicle-type.component';

@Component({
  selector: 'vh-fleet-overview-table',
  standalone: true,
  templateUrl: './fleet-overview-table.component.html',
  styleUrls: ['./fleet-overview-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FleetOverviewDetailComponent,
    OverlayModule,
    NgTemplateOutlet,
    DatePipe,
    MatMenuModule,
    RouterLink,
    MatTooltipModule,
    VehicleImageComponent,
    SkeletonLoadingComponent,
    RisksComponent,
    CriticalityComponent,
    MatProgressBarModule,
    ExpandIconComponent,
    NotAvailableComponent,
    BatteryHealthComponent,
    MatSortModule,
    VehicleTypeComponent,
    CurrentStatusComponent,
    PowertrainAnomalyComponent,
  ],
})
export class FleetOverviewTableComponent {
  displayedColumns: string[] = [
    'expand',
    'image',
    'vin',
    'name',
    'lastUpdated',
    'risk',
    'criticality',
    'anomaly',
  ];

  @Input() dataSource: FleetOverview[] = [];
  @Input() isLoading = true;
  @Input() pdUsecase: {
    [vin: string]: {
      batteryHealth?: RequestStatus<BatteryStatus | null>;
      powertrainAnomaly?: RequestStatus<PowertrainAnomaly | null>;
    };
  } = {};
  @Input() sortBy = '';
  @Input() sortDirection: SortDirection = '';

  @Output() toggle = new EventEmitter<FleetOverview>();
  @Output() sort = new EventEmitter<Sort>();

  @Output() loadBatteryHealth = new EventEmitter<string>();
  @Output() loadAnomalies = new EventEmitter<string>();

  expandedElement: FleetOverview | null = null;

  hasCriticality(data: FleetOverview) {
    return data.criticalityLevel !== 6;
  }

  toggleRow(event: MouseEvent, element: FleetOverview) {
    event.stopPropagation();
    this.expandedElement = this.expandedElement === element ? null : element;
    const isExpanded = this.expandedElement === element;
    if (isExpanded) this.toggle.emit(element);
  }

  onLoadBattery(vin: string) {
    this.loadBatteryHealth.emit(vin);
  }

  onLoadAnomalies(vin: string) {
    this.loadAnomalies.emit(vin);
  }

  updateSortChange(sort: Sort) {
    this.sort.emit(sort);
  }
}
