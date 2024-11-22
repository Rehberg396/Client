import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { LoadedRequestStatus, QueryParams, RequestStatus } from '@cps/types';
import { SearchInputComponent } from '@cps/ui';
import {
  toPageNumber,
  toPageSize,
  toSortDirection,
  toSortParam,
  toStringParam,
  unwrapPaging,
} from '@cps/util';
import { FleetOverviewStore } from '@cps/vehicle-health/fleets/overview/data-access';
import { FleetOverviewTableComponent } from '@cps/vehicle-health/fleets/overview/ui';
import { BatteryHealthComponent } from '@cps/vehicle-health/ui';
import { provideComponentStore } from '@ngrx/component-store';
import { combineLatest, map, tap } from 'rxjs';

@Component({
  selector: 'vh-fleet-overview',
  standalone: true,
  imports: [
    MatPaginatorModule,
    AsyncPipe,
    SearchInputComponent,
    FleetOverviewTableComponent,
    MatTooltipModule,
  ],
  templateUrl: './fleet-overview.component.html',
  styleUrl: './fleet-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(FleetOverviewStore)],
})
export class FleetOverviewComponent {
  private readonly store = inject(FleetOverviewStore);
  private readonly router = inject(Router);

  page = input(0, { transform: toPageNumber });
  size = input(0, { transform: toPageSize });
  search = input('', { transform: toStringParam });
  sortBy = input('', { transform: toStringParam });
  sortDirection = input('', { transform: toSortDirection });
  sort = computed(() =>
    toSortParam({
      active: this.sortBy(),
      direction: this.sortDirection(),
    })
  );

  queryState = computed(() => ({
    page: this.page(),
    size: this.size(),
    search: this.search(),
    sortBy: this.sortBy(),
    sortDirection: this.sortDirection(),
    sort: this.sort(),
  }));

  queryParams$ = toObservable(this.queryState).pipe(
    map((state) => {
      const queryParams: QueryParams = {};
      queryParams['page'] = state.page;
      queryParams['size'] = state.size;
      if (state.sort) {
        queryParams['sort'] = state.sort;
      }
      if (state.search) {
        queryParams['search'] = state.search;
      }
      return queryParams;
    }),
    tap((queryParams) => this.store.searchFleets(queryParams))
  );

  paging = unwrapPaging(this.store.selectors.fleetOverviewPage$);
  pdUsecase$ = this.store.selectors.pdUsecase$;

  vm$ = combineLatest([
    this.paging.dataSource$,
    this.paging.isLoading$,
    this.paging.totalElements$,
    this.paging.errorMessage$,
    this.pdUsecase$,
    this.queryParams$,
  ]).pipe(
    map(([dataSource, isLoading, totalElements, errorMessage, pdUsecase]) => ({
      dataSource,
      isLoading,
      totalElements,
      errorMessage,
      pdUsecase,
    }))
  );

  onSearch(value: string) {
    this.router.navigate([], {
      queryParams: {
        search: value,
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(value: PageEvent) {
    this.router.navigate([], {
      queryParams: {
        page: value.pageIndex,
        size: value.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(value: Sort) {
    this.router.navigate([], {
      queryParams: {
        sortBy: value.active,
        sortDirection: value.direction,
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  }

  onLoadBatteryHealth(vin: string) {
    this.store.loadBatteryHealth(vin);
  }

  onLoadAnomalies(vin: string) {
    this.store.loadAnomalies(vin);
  }
}
