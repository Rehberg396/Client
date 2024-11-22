import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  AnomalyHistory,
  PowertrainAnomalyHistory,
  RequestStatus,
} from '@cps/types';
import { IconLabelComponent, SkeletonLoadingComponent } from '@cps/ui';
import { PowertrainAnomalyColorPipe } from '../powertrain-anomaly-color.pipe';
import { PowertrainAnomalyStatusPipe } from '../powertrain-anomaly-status.pipe';
import { PowertrainAnomalyTypesPipe } from '../powertrain-anomaly-type.pipe';

type Unload = {
  status: 'unload';
};

type Loaded = {
  status: 'loaded';
  coolants: AnomalyHistory[];
  oils: AnomalyHistory[];
};

type Loading = {
  status: 'loading';
};

type LoadingState = Unload | Loading | Loaded;

@Component({
  selector: 'vh-powertrain-anomaly-table',
  standalone: true,
  templateUrl: './powertrain-anomaly-table.component.html',
  styleUrls: ['./powertrain-anomaly-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    PowertrainAnomalyColorPipe,
    PowertrainAnomalyStatusPipe,
    IconLabelComponent,
    PowertrainAnomalyTypesPipe,
    SkeletonLoadingComponent,
  ],
})
export class PowertrainAnomalyTableComponent {
  data = input<RequestStatus<PowertrainAnomalyHistory> | undefined>();

  loaded = output<void>();

  vm = computed<LoadingState>(() => {
    const current = this.data();
    if (!current) {
      return {
        status: 'unload',
      };
    }
    if (current.loadingState == 'loaded') {
      this.loaded.emit();
      return {
        status: 'loaded',
        coolants: current.data.coolantHistories,
        oils: current.data.oilHistories,
      };
    }
    return {
      status: 'loading',
    };
  });
}
