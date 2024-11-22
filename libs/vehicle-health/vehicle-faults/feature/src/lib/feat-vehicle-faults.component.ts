import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FaultDismissInfo, QueryParams, RichVehicleFault } from '@cps/types';
import { ConfirmDialogComponent } from '@cps/ui';
import {
  deserializeDisplayedColumns,
  serializeDisplayedColumns,
  toPageNumber,
  toPageSize,
  toSortDirection,
  toSortParam,
  toStringParam,
  unwrapPaging,
} from '@cps/util';
import { VehicleFaultStore } from '@cps/vehicle-health/vehicle-faults/data-access';
import {
  ProcessingStageDialogComponent,
  VehicleFaultsComponent,
} from '@cps/vehicle-health/vehicle-faults/ui';
import { provideComponentStore } from '@ngrx/component-store';
import { combineLatest, map, take, tap } from 'rxjs';

@Component({
  selector: 'vh-feat-vehicle-faults',
  standalone: true,
  imports: [AsyncPipe, VehicleFaultsComponent],
  templateUrl: './feat-vehicle-faults.component.html',
  styleUrl: './feat-vehicle-faults.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(VehicleFaultStore)],
})
export class FeatVehicleFaultsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly store = inject(VehicleFaultStore);
  private readonly router = inject(Router);

  vin = input.required<string>();
  page = input(0, { transform: toPageNumber });
  size = input(10, { transform: toPageSize });
  sortDirection = input('', { transform: toSortDirection });
  sortBy = input('', { transform: toStringParam });
  sort = computed(() => {
    const sortBy = this.sortBy();
    const sortDirection = this.sortDirection();
    return toSortParam({ active: sortBy, direction: sortDirection });
  });
  displayedColumns = input(
    { isHidden: () => false },
    { transform: (value: unknown) => deserializeDisplayedColumns(value) }
  );
  params = computed(() => ({
    vin: this.vin(),
    page: this.page(),
    size: this.size(),
    sort: this.sort(),
  }));

  queryParams$ = toObservable(this.params).pipe(
    map((params) => {
      const queryParams = this.toQueryParams(params);
      return { vin: params.vin, queryParams };
    }),
    tap((value) => this.store.getVehicleFaults(value))
  );

  private toQueryParams(params: {
    page: number;
    size: number;
    sort: string | undefined;
  }) {
    const queryParams: QueryParams = {};
    queryParams['page'] = params.page;
    queryParams['size'] = params.size;
    if (params.sort) {
      queryParams['sort'] = params.sort;
    }
    return queryParams;
  }

  paging = unwrapPaging(this.store.selectors.vehicleFaults$);

  vm$ = combineLatest([
    this.paging.dataSource$,
    this.paging.isLoading$,
    this.paging.errorMessage$,
    this.paging.totalElements$,
    this.queryParams$,
  ]).pipe(
    map(([dataSource, isLoading, errorMessage, totalElements]) => ({
      dataSource,
      isLoading,
      errorMessage,
      totalElements,
    }))
  );

  onDisplayedColumnsChange(value: string[]) {
    this.router.navigate([], {
      queryParams: {
        displayedColumns: serializeDisplayedColumns(value),
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(event: PageEvent): void {
    this.router.navigate([], {
      queryParams: {
        page: event.pageIndex,
        size: event.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(event: Sort): void {
    this.router.navigate([], {
      queryParams: {
        sortDirection: event.direction,
        sortBy: event.active,
      },
      queryParamsHandling: 'merge',
    });
  }

  openHistoryDialog(data: RichVehicleFault) {
    this.store.loadHistories(data);
    this.dialog
      .open(ProcessingStageDialogComponent, {
        data: this.store.selectors.vehicleFaultHistories$,
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => this.store.clearHistories());
  }

  openDialogDismiss(fault: FaultDismissInfo): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: $localize`Dismiss Vehicle Fault`,
          contentTitle: `${fault.status} -> inactive`,
          leftButtonText: $localize`Confirm`,
          rightButtonText: $localize`Cancel`,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.store.dismissFault({
            payload: fault,
            onSuccess: () => {
              const params = this.params();
              if (params.vin) {
                this.store.getVehicleFaults({
                  vin: params.vin,
                  queryParams: this.toQueryParams(params),
                });
              }
            },
          });
        }
      });
  }
}
