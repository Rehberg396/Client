import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  BatteryStatus,
  DtcTemplateGroup,
  PowertrainAnomaly,
  PowertrainAnomalyHistory,
  RequestStatus,
} from '@cps/types';
import {
  CircleComponent,
  DtcGroupIconPipe,
  ExpandIconComponent,
  FilterComponent,
  IconLabelComponent,
  SearchInputComponent,
} from '@cps/ui';
import {
  CriticalityComponent,
  CriticalitySelectComponent,
  PowertrainAnomalyStatusPipe,
  RisksComponent,
} from '@cps/vehicle-health/ui';
import { CriticalityCellComponent } from '../criticality-cell/criticality-cell.component';
import { ExpandCellComponent } from '../expand-cell/expand-cell.component';
import { ExpandedDetailComponent } from '../expanded-detail/expanded-detail.component';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import { RiskCellComponent } from '../risk-cell/risk-cell.component';

export type Title = {
  icon: string;
  title: string;
  descriptions: string[];
};

export type BatteryItem = {
  type: 'battery';
} & (
  | ({ status: 'loaded'; data: BatteryStatus } & Title)
  | { status: 'error' }
  | { status: 'loading' }
);

export type PowertrainAnomalyItem = {
  type: 'powertrain-anomaly';
} & (
  | ({
      status: 'loaded';
      data: PowertrainAnomaly & {
        history?: RequestStatus<PowertrainAnomalyHistory>;
      };
    } & Title)
  | { status: 'error' }
  | { status: 'loading' }
);

export type DtcTemplateItem = {
  type: 'dtcTemplate';
} & (
  | ({ status: 'loaded'; data: DtcTemplateGroup } & Title)
  | { status: 'error' }
  | { status: 'loading' }
);

export type Item = (BatteryItem | PowertrainAnomalyItem | DtcTemplateItem) & {
  isUpdating: boolean;
};

@Component({
  selector: 'vh-vehicle-detail-table',
  standalone: true,
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
  templateUrl: './vehicle-detail-table.component.html',
  styleUrls: ['./vehicle-detail-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatTableModule,
    CircleComponent,
    MatButtonModule,
    SearchInputComponent,
    FilterComponent,
    RouterLink,
    CriticalitySelectComponent,
    MatMenuModule,
    MatTooltipModule,
    CriticalityComponent,
    ExpandIconComponent,
    RisksComponent,
    DtcGroupIconPipe,
    ItemDetailComponent,
    IconLabelComponent,
    DatePipe,
    RiskCellComponent,
    CriticalityCellComponent,
    ExpandCellComponent,
    ExpandedDetailComponent,
  ],
})
export class VehicleDetailTableComponent {
  paStatusPipe = new PowertrainAnomalyStatusPipe();
  displayedColumns: string[] = ['item', 'risk', 'criticality', 'expand'];
  vin = input('');
  isPowertrainHistoryLoaded = false;

  #dataSource: Item[] = [];
  @Input() set dataSource({
    powertrainAnomaly,
    batteryHealth,
    dtcGroup,
    powertrainAnomalyHistory,
  }: {
    dtcGroup: RequestStatus<DtcTemplateGroup[]> & { isUpdating?: boolean };
    batteryHealth: RequestStatus<BatteryStatus> & { isUpdating?: boolean };
    powertrainAnomaly: RequestStatus<PowertrainAnomaly> & {
      isUpdating?: boolean;
    };
    powertrainAnomalyHistory: RequestStatus<PowertrainAnomalyHistory>;
  }) {
    this.#dataSource = [
      ...this.fromBatteryHealth(batteryHealth).map((value) => ({
        ...value,
        isUpdating: Boolean(batteryHealth.isUpdating),
      })),
      ...this.fromPA(powertrainAnomaly, powertrainAnomalyHistory).map(
        (value) => ({
          ...value,
          isUpdating: Boolean(powertrainAnomaly.isUpdating),
        })
      ),
      ...this.fromDtcTemplateGroup(dtcGroup).map((value) => ({
        ...value,
        isUpdating: Boolean(dtcGroup.isUpdating),
      })),
    ];
  }

  get dataSource(): Item[] {
    return this.#dataSource;
  }

  searchOutput = output<string>();
  filterCriticality = output<string>();
  loadPowertrainHistory = output<string>();
  powertrainAnomalyHistory = input<RequestStatus<PowertrainAnomalyHistory>>();

  expandedElement = input<string | null>(null);
  toggle = output<string>();

  handleClick(item: Item & { title: string }) {
    if (item.type === 'battery') {
      return;
    }

    if (this.isPowertrainAnomalyLoaded(item)) {
      if (this.isHealthy(item)) {
        return;
      }

      if (!this.isPowertrainHistoryLoaded) {
        this.loadPowertrainHistory.emit(item.data.vin);
      }
    }

    this.toggle.emit(item.title);
  }

  onFilterCriticality(criticality: string): void {
    this.filterCriticality.emit(criticality);
  }

  private fromBatteryHealth(
    batteryStatus: RequestStatus<BatteryStatus>
  ): Item[] {
    if (batteryStatus.loadingState === 'error') {
      return [];
    }

    if (batteryStatus.loadingState === 'loaded') {
      return [
        {
          type: 'battery',
          icon: 'bosch-ic-battery-car-charging',
          title: $localize`Starter Battery Health`,
          descriptions: [batteryStatus.data.recommendation],
          data: batteryStatus.data,
          status: 'loaded',
          isUpdating: false,
        },
      ];
    }
    return [
      {
        type: 'battery',
        status: 'loading',
        isUpdating: false,
      },
    ];
  }

  private fromDtcTemplateGroup(
    dtcGroup: RequestStatus<DtcTemplateGroup[]>
  ): Item[] {
    if (dtcGroup.loadingState === 'error') {
      return [];
    }

    if (dtcGroup.loadingState === 'loaded') {
      const pipe = new DtcGroupIconPipe();
      return dtcGroup.data.map((value) => ({
        type: 'dtcTemplate',
        icon: pipe.transform(value.dtcCategoryGroup),
        title: value.dtcCategoryGroup,
        descriptions: value.recommendations,
        data: value,
        status: 'loaded',
        isUpdating: false,
      }));
    }

    return [
      {
        type: 'dtcTemplate',
        status: 'loading',
        isUpdating: false,
      },
    ];
  }

  private fromPA(
    paData: RequestStatus<PowertrainAnomaly>,
    history: RequestStatus<PowertrainAnomalyHistory>
  ): Item[] {
    if (paData.loadingState === 'error') {
      return [];
    }

    if (paData.loadingState === 'loaded') {
      return [
        {
          type: 'powertrain-anomaly',
          icon: 'bosch-ic-wrench',
          title: $localize`Powertrain Anomaly`,
          descriptions: [
            this.paStatusPipe.transform('COOLANT', paData.data.coolantStatus),
            this.paStatusPipe.transform('OIL', paData.data.oilStatus),
          ],
          data: { ...paData.data, history },
          status: 'loaded',
          isUpdating: false,
        },
      ];
    }
    return [
      {
        type: 'powertrain-anomaly',
        status: 'loading',
        isUpdating: false,
      },
    ];
  }

  handleLoadedPowertrainHistory() {
    this.isPowertrainHistoryLoaded = true;
  }

  private isPowertrainAnomalyLoaded(item: Item) {
    return item.type === 'powertrain-anomaly' && item.status === 'loaded';
  }

  isHealthy(item: Item) {
    if (this.isPowertrainAnomalyLoaded(item)) {
      const { coolantStatus, oilStatus } = item.data;
  
      return (coolantStatus === 0 && oilStatus === 0) ||
             (coolantStatus === 0 && oilStatus === null) ||
             (coolantStatus === null && oilStatus === 0) ||
             (coolantStatus === null && oilStatus === null);
    }
    return false;
  }
}
