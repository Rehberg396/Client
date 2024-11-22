import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FaultDismissInfo, RichVehicleFault } from '@cps/types';
import { ColumnConfig, ColumnConfigComponent, TableComponent } from '@cps/ui';

@Component({
  selector: 'vh-vehicle-faults',
  standalone: true,
  templateUrl: './vehicle-faults.component.html',
  styleUrls: ['./vehicle-faults.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableComponent,
    AsyncPipe,
    MatPaginatorModule,
    ColumnConfigComponent,
  ],
})
export class VehicleFaultsComponent {
  vin = input.required<string>();
  page = input.required<number>();
  size = input.required<number>();
  sortDirection = input.required<'asc' | 'desc' | ''>();
  sortBy = input.required<string>();
  displayedColumns = input.required<{ isHidden: (key: string) => boolean }>();

  dismiss = output<FaultDismissInfo>();
  history = output<RichVehicleFault>();

  columnConfigs = computed<ColumnConfig<RichVehicleFault>[]>(() => {
    const displayedColumns = this.displayedColumns();
    const isHidden = displayedColumns.isHidden;
    return [
      {
        label: $localize`Actions`,
        type: 'action',
        key: 'action',
        actions: [
          {
            icon: () => 'bosch-ic-abort-frame',
            tooltip: () => $localize`Dismiss`,
            disable: (value) => {
              return value.status === 'inactive';
            },
            onClick: (fault) => {
              this.dismiss.emit(fault);
            },
          },
          {
            icon: () => 'bosch-ic-history',
            tooltip: () => $localize`History`,
            onClick: (data) => {
              this.history.emit(data);
            },
          },
        ],
        hidden: isHidden('action'),
      },
      {
        key: 'start',
        label: $localize`Start`,
        type: 'date',
        format: 'medium',
        canSort: true,
        minWidth: '15rem',
        hidden: isHidden('start'),
      },
      {
        key: 'end',
        label: $localize`End`,
        type: 'date',
        format: 'medium',
        canSort: true,
        minWidth: '15rem',
        hidden: isHidden('end'),
      },
      {
        key: 'faultDateTime',
        type: 'date',
        label: $localize`Last Update`,
        format: 'medium',
        canSort: true,
        minWidth: '15rem',
        hidden: isHidden('faultDateTime'),
      },
      {
        key: 'status',
        type: 'text',
        label: $localize`Status`,
        canSort: true,
        hidden: isHidden('status'),
      },
      {
        key: 'dtcCode',
        type: 'text',
        label: $localize`DTC Code`,
        canSort: true,
        hidden: isHidden('dtcCode'),
      },
      {
        key: 'protocolStandard',
        type: 'text',
        label: $localize`Protocol Standard`,
        canSort: true,
        hidden: isHidden('protocolStandard'),
      },
      {
        key: 'faultOrigin',
        type: 'text',
        label: $localize`Source`,
        canSort: true,
        hidden: isHidden('faultOrigin'),
      },
      {
        key: 'description',
        label: $localize`Description`,
        type: 'text',
        canSort: false,
        minWidth: '20rem',
        hidden: isHidden('description'),
      },
      {
        key: 'possibleCause',
        label: $localize`Possible Cause`,
        type: 'text',
        canSort: false,
        minWidth: '20rem',
        hidden: isHidden('possibleCause'),
      },
      {
        key: 'possibleSymptoms',
        label: $localize`Possible Symptoms`,
        type: 'text',
        canSort: false,
        minWidth: '20rem',
        hidden: isHidden('possibleSymptoms'),
      },
      {
        key: 'criticality',
        label: $localize`Criticality`,
        type: 'text',
        canSort: true,
        hidden: isHidden('criticality'),
      },
      {
        key: 'recommendations',
        type: 'text',
        label: $localize`Recommendations`,
        canSort: false,
        minWidth: '20rem',
        hidden: isHidden('recommendations'),
      },
    ];
  });

  tableColumnConfigs = computed(() =>
    this.columnConfigs().map((config) => ({
      key: config.key,
      title: config.label,
      isChecked: !config.hidden,
    }))
  );

  displayedColumnsChange = output<string[]>();
  pageChange = output<PageEvent>();
  sortChange = output<Sort>();

  dataSource = input.required<RichVehicleFault[]>();
  isLoading = input.required<boolean>();
  errorMessage = input<string>('');
  totalElements = input.required<number>();
}
