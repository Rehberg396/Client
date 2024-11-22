import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BatteryStatus,
  FleetOverview,
  PagingResponseModel,
  PowertrainAnomaly,
  QueryParams,
  RequestStatus,
} from '@cps/types';
import { ToastService } from '@cps/ui';
import { ComponentStoreWithSelectors } from '@cps/util';
import {
  BatteryHealthService,
  FleetService,
  PowertrainAnomalyService,
} from '@cps/vehicle-health/data-access';
import { OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { mergeMap, switchMap } from 'rxjs';

export interface PdUsecase {
  [vin: string]: {
    batteryHealth?: RequestStatus<BatteryStatus | null>;
    powertrainAnomaly?: RequestStatus<PowertrainAnomaly | null>;
  };
}

export interface FleetOverviewState {
  fleetOverviewPage: RequestStatus<PagingResponseModel<FleetOverview>>;
  pdUsecase: PdUsecase;
}

const initialState: FleetOverviewState = {
  fleetOverviewPage: { loadingState: 'initial' },
  pdUsecase: {},
};

@Injectable()
export class FleetOverviewStore
  extends ComponentStoreWithSelectors<FleetOverviewState>
  implements OnStoreInit
{
  private readonly fleetService = inject(FleetService);
  private readonly toast = inject(ToastService);
  private readonly batteryHealthService = inject(BatteryHealthService);
  private readonly paService = inject(PowertrainAnomalyService);

  ngrxOnStoreInit = () => {
    this.setState(initialState);
  };

  readonly searchFleets = this.effect<QueryParams>(
    switchMap((queryParams) => {
      this.patchState((state) => ({
        ...state,
        fleetOverviewPage: {
          ...state.fleetOverviewPage,
          loadingState: 'loading',
        },
      }));

      return this.fleetService.fetchFleetOverview(queryParams).pipe(
        tapResponse(
          ({ data }) => {
            this.patchState((state) => ({
              ...state,
              fleetOverviewPage: {
                loadingState: 'loaded',
                data: data,
              },
              pdUsecase: {},
            }));
          },
          (error: HttpErrorResponse) => {
            const errorMsg =
              error.error.message || $localize`Internal Server Error`;
            this.toast.error(errorMsg);
            this.patchState((state) => ({
              ...state,
              fleetOverviewPage: {
                ...state.fleetOverviewPage,
                loadingState: 'error',
                message: errorMsg,
              },
              pdUsecase: {},
            }));
          }
        )
      );
    })
  );

  readonly loadBatteryHealth = this.effect<string>(
    mergeMap((vin) => {
      this.patchState(({ pdUsecase }) => {
        if (!pdUsecase[vin]) {
          return {
            pdUsecase: {
              ...pdUsecase,
              [vin]: {
                batteryHealth: {
                  loadingState: 'loading',
                },
              },
            },
          };
        }
        return {
          pdUsecase: {
            ...pdUsecase,
            [vin]: {
              ...pdUsecase[vin],
              batteryHealth: {
                ...pdUsecase[vin].batteryHealth,
                loadingState: 'loading',
              },
            },
          },
        };
      });

      return this.batteryHealthService.getLatestBatteryStatus(vin).pipe(
        tapResponse(
          (response) => {
            const data = response.data;
            this.patchState(({ pdUsecase }) => ({
              pdUsecase: {
                ...pdUsecase,
                [vin]: {
                  ...pdUsecase[vin],
                  batteryHealth: {
                    loadingState: 'loaded',
                    data: data,
                  },
                },
              },
            }));
          },
          (error: string) => {
            this.patchState(({ pdUsecase }) => ({
              pdUsecase: {
                ...pdUsecase,
                [vin]: {
                  ...pdUsecase[vin],
                  batteryHealth: {
                    ...pdUsecase[vin].batteryHealth,
                    loadingState: 'error',
                    message: error,
                  },
                },
              },
            }));
          }
        )
      );
    })
  );

  readonly loadAnomalies = this.effect<string>(
    mergeMap((vin) => {
      this.patchState(({ pdUsecase }) => {
        if (!pdUsecase[vin]) {
          return {
            pdUsecase: {
              ...pdUsecase,
              [vin]: {
                powertrainAnomaly: {
                  loadingState: 'loading',
                },
              },
            },
          };
        }
        return {
          pdUsecase: {
            ...pdUsecase,
            [vin]: {
              ...pdUsecase[vin],
              powertrainAnomaly: {
                ...pdUsecase[vin].powertrainAnomaly,
                loadingState: 'loading',
              },
            },
          },
        };
      });

      return this.paService.getLatestPowertrainAnomaly(vin).pipe(
        tapResponse(
          (response) => {
            const data = response.data;
            this.patchState(({ pdUsecase }) => ({
              pdUsecase: {
                ...pdUsecase,
                [vin]: {
                  ...pdUsecase[vin],
                  powertrainAnomaly: {
                    loadingState: 'loaded',
                    data: data,
                  },
                },
              },
            }));
          },
          (error: string) => {
            this.patchState(({ pdUsecase }) => ({
              pdUsecase: {
                ...pdUsecase,
                [vin]: {
                  ...pdUsecase[vin],
                  powertrainAnomaly: {
                    ...pdUsecase[vin].powertrainAnomaly,
                    loadingState: 'error',
                    message: error,
                  },
                },
              },
            }));
          }
        )
      );
    })
  );
}
