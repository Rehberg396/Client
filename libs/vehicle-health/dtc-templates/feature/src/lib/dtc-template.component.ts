import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DtcTemplate, QueryParams } from '@cps/types';
import {
  ButtonComponent,
  ColumnConfig,
  ColumnConfigComponent,
  ConfirmDialogComponent,
  FilterComponent,
  FilterOption,
  SearchInputComponent,
  TableComponent,
} from '@cps/ui';
import {
  deserializeDisplayedColumns,
  deserializeFilters,
  serializeDisplayedColumns,
  serializeFilters,
  toPageNumber,
  toPageSize,
  toStringParam,
  unwrapPaging,
} from '@cps/util';
import { DtcTemplateStore } from '@cps/vehicle-health/dtc-templates/data-access';
import { DtcFormComponent } from '@cps/vehicle-health/dtc-templates/ui';
import { provideComponentStore } from '@ngrx/component-store';
import { combineLatest, map, tap } from 'rxjs';

@Component({
  selector: 'vh-dtc-template',
  standalone: true,
  imports: [
    CommonModule,
    SearchInputComponent,
    FilterComponent,
    TableComponent,
    MatPaginatorModule,
    ColumnConfigComponent,
    MatIconModule,
    ButtonComponent,
  ],
  templateUrl: './dtc-template.component.html',
  styleUrl: './dtc-template.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(DtcTemplateStore)],
})
export class DtcTemplateComponent {
  private readonly store = inject(DtcTemplateStore);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  criticalities$ = this.store.selectors.criticalities$;
  engineTypes$ = this.store.selectors.engineTypes$;

  page = input(0, { transform: toPageNumber });
  size = input(0, { transform: toPageSize });
  search = input('', { transform: toStringParam });
  filters = input(
    { criticalities: new Set([]), engineTypes: new Set([]) },
    { transform: (value: unknown) => deserializeFilters(value) }
  );
  displayedColumns = input(
    { isHidden: () => false },
    { transform: (value: unknown) => deserializeDisplayedColumns(value) }
  );

  count = signal(0);
  private refresh() {
    this.count.update((state) => state + 1);
  }

  queryState = computed(() => ({
    page: this.page(),
    size: this.size(),
    search: this.search(),
    filters: this.filters(),
    count: this.count(),
  }));

  queryParams$ = toObservable(this.queryState).pipe(
    map((state) => {
      const queryParams: QueryParams = {};
      queryParams['page'] = state.page;
      queryParams['size'] = state.size;
      if (state.search) {
        queryParams['search'] = state.search;
      }
      Object.entries(state.filters).forEach(([key, value]) => {
        queryParams[key] = [...value];
      });
      return queryParams;
    }),
    tap((queryParams) => this.store.searchDtcTemplates(queryParams))
  );

  tableFilterOption$ = combineLatest([
    this.criticalities$,
    this.engineTypes$,
  ]).pipe(
    map(([criticalities, engineTypes]) => [
      {
        key: 'engineTypes',
        title: $localize`Engine Type`,
        selectOption: engineTypes.map((value) => ({
          label: value,
          value: value,
          isChecked: Boolean(this.filters()['engineTypes']?.has(value)),
        })),
        isChecked: Boolean(this.filters()['engineTypes']?.size),
      } as FilterOption,
      {
        key: 'criticalities',
        title: $localize`Criticality`,
        selectOption: criticalities.map((value) => ({
          label: value,
          value: value,
          isChecked: Boolean(this.filters()['criticalities']?.has(value)),
        })),
        isChecked: Boolean(this.filters()['criticalities']?.size),
      } as FilterOption,
    ])
  );

  paging = unwrapPaging(this.store.selectors.dtcTemplatePage$);

  vm$ = combineLatest([
    this.paging.isLoading$,
    this.paging.dataSource$,
    this.paging.errorMessage$,
    this.paging.totalElements$,
    this.tableFilterOption$,
    this.queryParams$,
  ]).pipe(
    map(
      ([
        isLoading,
        dataSource,
        errorMessage,
        totalElements,
        tableFilterOption,
      ]) => ({
        isLoading,
        dataSource,
        errorMessage,
        totalElements,
        tableFilterOption,
      })
    )
  );

  columnConfigs = computed<ColumnConfig<DtcTemplate>[]>(() => {
    return [
      {
        label: $localize`Actions`,
        type: 'action',
        key: 'action',
        actions: [
          {
            icon: () => 'bosch-ic-edit',
            tooltip: () => $localize`Edit`,
            onClick: (value) => {
              this.onEdit(value);
            },
          },
          {
            icon: () => 'bosch-ic-delete',
            tooltip: () => $localize`Delete`,
            onClick: (value) => {
              this.onDelete(value);
            },
          },
        ],
        hidden: this.displayedColumns().isHidden('action'),
      },
      {
        label: $localize`Source`,
        key: 'source',
        type: 'text',
        hidden: this.displayedColumns().isHidden('source'),
      },
      {
        label: $localize`Category`,
        key: 'category',
        type: 'text',
        hidden: this.displayedColumns().isHidden('category'),
      },
      {
        label: $localize`Group`,
        key: 'group',
        type: 'text',
        hidden: this.displayedColumns().isHidden('group'),
      },
      {
        label: $localize`Engine Type`,
        key: 'engineType',
        type: 'text',
        hidden: this.displayedColumns().isHidden('engineType'),
      },
      {
        label: $localize`Protocol Standard`,
        key: 'protocolStandard',
        type: 'text',
        hidden: this.displayedColumns().isHidden('protocolStandard'),
      },
      {
        label: $localize`DTC Code`,
        key: 'dtcCode',
        type: 'text',
        hidden: this.displayedColumns().isHidden('dtcCode'),
      },
      {
        label: $localize`OEM`,
        key: 'oem',
        type: 'text',
        hidden: this.displayedColumns().isHidden('oem'),
      },
      {
        label: $localize`DTC Description`,
        key: 'description',
        type: 'text',
        minWidth: '20rem',
        hidden: this.displayedColumns().isHidden('description'),
      },
      {
        label: $localize`Possible Cause`,
        key: 'possibleCause',
        type: 'text',
        minWidth: '20rem',
        hidden: this.displayedColumns().isHidden('possibleCause'),
      },
      {
        label: $localize`Symptom`,
        key: 'symptom',
        type: 'text',
        minWidth: '20rem',
        hidden: this.displayedColumns().isHidden('symptom'),
      },
      {
        label: $localize`Criticality`,
        key: 'criticality',
        type: 'text',
        hidden: this.displayedColumns().isHidden('criticality'),
      },
      {
        label: $localize`Recommendation`,
        key: 'recommendations',
        type: 'text',
        minWidth: '20rem',
        hidden: this.displayedColumns().isHidden('recommendations'),
      },
      {
        label: $localize`Comment`,
        key: 'comment',
        type: 'text',
        hidden: this.displayedColumns().isHidden('comment'),
      },
      {
        label: $localize`Risk Safety`,
        key: 'riskSafety',
        type: 'text',
        hidden: this.displayedColumns().isHidden('riskSafety'),
      },
      {
        label: $localize`Risk Availability`,
        key: 'riskDamage',
        type: 'text',
        hidden: this.displayedColumns().isHidden('riskDamage'),
      },
      {
        label: $localize`Risk Damage`,
        key: 'riskAvailability',
        type: 'text',
        hidden: this.displayedColumns().isHidden('riskAvailability'),
      },
      {
        label: $localize`Risk Emissions`,
        key: 'riskEmissions',
        type: 'text',
        hidden: this.displayedColumns().isHidden('riskEmissions'),
      },
    ];
  });

  tableColumnConfigs = computed(() => {
    const columnConfigs = this.columnConfigs();
    return columnConfigs.map((config) => ({
      key: config.key,
      title: config.label,
      isChecked: Boolean(!config.hidden),
    }));
  });

  onTableColumnConfigsChange(value: string[]) {
    this.router.navigate([], {
      queryParams: {
        displayedColumns: serializeDisplayedColumns(value),
      },
      queryParamsHandling: 'merge',
    });
  }

  onFilterChange(value: FilterOption[]) {
    const filters: {
      criticalities: string[];
      engineTypes: string[];
    } = { criticalities: [], engineTypes: [] };
    value.forEach((v) => {
      if (v.key === 'criticalities') {
        filters.criticalities = v.selectOption
          .filter((c) => !!c.isChecked)
          .map((c) => `${c.value}`);
      }
      if (v.key === 'engineTypes') {
        filters.engineTypes = v.selectOption
          .filter((c) => !!c.isChecked)
          .map((c) => `${c.value}`);
      }
    });
    this.router.navigate([], {
      queryParams: {
        filters: serializeFilters(filters),
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSearch(search: string) {
    this.router.navigate([], {
      queryParams: {
        search,
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPage(event: PageEvent) {
    this.router.navigate([], {
      queryParams: {
        page: event.pageIndex,
        size: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  onCreate(): void {
    const dialogRef = this.dialog.open(DtcFormComponent, {
      width: '60%',
      disableClose: true,
      data: {
        dtcItem: undefined,
        options: {
          risks: this.store.selectSignal((s) => s.risks)(),
          criticalities: this.store.selectSignal((s) => s.criticalities)(),
          engineTypes: this.store.selectSignal((s) => s.engineTypes)(),
        },
      },
    });

    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.handleSubmit = (dtc) => {
      this.store.create({
        dtcData: dtc,
        handler: {
          handleLoading: (isLoading: boolean) => {
            dialogInstance.isLoading.set(isLoading);
          },
          onSuccess: () => {
            dialogRef.close();
            this.refresh();
          },
        },
      });
    };
  }

  private onEdit(dtcItem: DtcTemplate): void {
    const dialogRef = this.dialog.open(DtcFormComponent, {
      width: '60%',
      disableClose: true,
      data: {
        dtcItem,
        options: {
          risks: this.store.selectSignal((s) => s.risks)(),
          criticalities: this.store.selectSignal((s) => s.criticalities)(),
          engineTypes: this.store.selectSignal((s) => s.engineTypes)(),
        },
      },
    });

    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.handleSubmit = (data) => {
      this.store.edit({
        dtcData: data,
        handler: {
          handleLoading: (isLoading) => {
            dialogInstance.isLoading.set(isLoading);
          },
          onSuccess: () => {
            dialogRef.close();
            this.refresh();
          },
        },
      });
    };
  }

  private onDelete(dtcItem: DtcTemplate): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: $localize`Delete DTC Template`,
        contentTitle: $localize`Are you sure to delete?`,
        leftButtonText: $localize`Confirm`,
        rightButtonText: $localize`Cancel`,
      },
    });

    const confirmDialog = dialogRef.componentInstance;
    confirmDialog.onClickConfirm = () => {
      this.store.delete({
        dtcData: dtcItem,
        handler: {
          handleLoading: (isLoading) => {
            confirmDialog.isLoading.set(isLoading);
          },
          onSuccess: () => {
            dialogRef.close();
            this.refresh();
          },
        },
      });
    };
  }
}
