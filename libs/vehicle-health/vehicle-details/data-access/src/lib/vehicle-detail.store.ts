import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BatteryStatus,
  DtcTemplateGroup,
  FleetOverview,
  PowertrainAnomaly,
  PowertrainAnomalyHistory,
  RequestStatus,
  Vehicle,
} from '@cps/types';
import { ComponentStoreWithSelectors } from '@cps/util';
import {
  BatteryHealthService,
  DtcCategoryGroupService,
  FleetService,
  PowertrainAnomalyService,
  VehicleService,
} from '@cps/vehicle-health/data-access';
import { OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { combineLatest, switchMap } from 'rxjs';

export type IsUpdating = { isUpdating?: boolean };

export interface VehicleDetailState {
  vehicle: RequestStatus<Vehicle> & IsUpdating;
  fleetOverview: RequestStatus<FleetOverview> & IsUpdating;
  dtcGroup: RequestStatus<DtcTemplateGroup[]> & IsUpdating;
  batteryHealth: RequestStatus<BatteryStatus> & IsUpdating;
  powertrainAnomaly: RequestStatus<PowertrainAnomaly> & IsUpdating;
  powertrainAnomalyHistory: RequestStatus<PowertrainAnomalyHistory>;
}

const initialState: VehicleDetailState = {
  vehicle: {
    loadingState: 'initial',
  },
  fleetOverview: {
    loadingState: 'initial',
  },
  dtcGroup: {
    loadingState: 'initial',
  },
  batteryHealth: {
    loadingState: 'initial',
  },
  powertrainAnomaly: {
    loadingState: 'initial',
  },
  powertrainAnomalyHistory: {
    loadingState: 'initial',
  },
};

@Injectable()
export class VehicleDetailStore
  extends ComponentStoreWithSelectors<VehicleDetailState>
  implements OnStoreInit
{
  private readonly vehicleService = inject(VehicleService);
  private readonly fleetService = inject(FleetService);
  private readonly batteryHealthService = inject(BatteryHealthService);
  private readonly paService = inject(PowertrainAnomalyService);
  private readonly dtcCategoryGroupService = inject(DtcCategoryGroupService);

  ngrxOnStoreInit(): void {
    this.setState(initialState);
  }

  readonly loadVehicle = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        vehicle: {
          ...state.vehicle,
          loadingState: 'loading',
        },
      }));

      return this.vehicleService.getByVin(vin).pipe(
        tapResponse(
          (next) => {
            this.patchState({
              vehicle: {
                data: next.data,
                loadingState: 'loaded',
              },
            });
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({
              vehicle: {
                ...state.vehicle,
                loadingState: 'error',
                message: error.error.message,
              },
            }));
          }
        )
      );
    })
  );

  readonly loadOneFleetOverview = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        fleetOverview: { ...state.fleetOverview, loadingState: 'loading' },
      }));

      return this.fleetService.fetchOneFleetOverview(vin).pipe(
        tapResponse(
          (next) => {
            this.patchState({
              fleetOverview: {
                data: next.data,
                loadingState: 'loaded',
              },
            });
          },
          (error: HttpErrorResponse) => {
            this.patchState((state) => ({
              fleetOverview: {
                ...state.fleetOverview,
                loadingState: 'error',
                message: error.error.message,
              },
            }));
          }
        )
      );
    })
  );

  readonly loadDtcGroup = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        dtcGroup: {
          ...state.dtcGroup,
          loadingState: 'loading',
        },
      }));
      return this.dtcCategoryGroupService.getDtcTemplateGroups(vin).pipe(
        tapResponse(
          ({ data }) => {
            this.patchState({
              dtcGroup: {
                loadingState: 'loaded',
                data: data,
              },
            });
          },
          (error: HttpErrorResponse) => {
            this.patchState({
              dtcGroup: {
                message: error.error.message,
                loadingState: 'error',
              },
            });
          }
        )
      );
    })
  );

  readonly loadBatteryHealth = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        batteryHealth: {
          ...state.batteryHealth,
          loadingState: 'loading',
        },
      }));

      return this.batteryHealthService.getBatteryStatus(vin).pipe(
        tapResponse(
          (next) => {
            this.patchState({
              batteryHealth: {
                data: next.data,
                loadingState: 'loaded',
              },
            });
          },
          (error: HttpErrorResponse) => {
            this.patchState({
              batteryHealth: {
                loadingState: 'error',
                message: error.error.message,
              },
            });
          }
        )
      );
    })
  );

  readonly loadPowertrainAnomaly = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        powertrainAnomaly: {
          ...state.powertrainAnomaly,
          loadingState: 'loading',
        },
      }));

      return this.paService.getLatestPowertrainAnomaly(vin).pipe(
        tapResponse(
          (next) => {
            this.patchState({
              powertrainAnomaly: {
                data: next.data,
                loadingState: 'loaded',
              },
            });
          },
          (error: HttpErrorResponse) => {
            this.patchState({
              powertrainAnomaly: {
                loadingState: 'error',
                message: error.error.message,
              },
            });
          }
        )
      );
    })
  );

  readonly loadPowertrainAnomalyHistory = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        powertrainAnomalyHistory: {
          ...state.powertrainAnomalyHistory,
          loadingState: 'loading',
        },
      }));

      return this.paService.getPowertrainAnomalyHistory(vin).pipe(
        tapResponse(
          (next) => {
            this.patchState({
              powertrainAnomalyHistory: {
                data: next.data,
                loadingState: 'loaded',
              },
            });
          },
          (error: HttpErrorResponse) => {
            this.patchState({
              powertrainAnomaly: {
                loadingState: 'error',
                message: error.error.message,
              },
            });
          }
        )
      );
    })
  );

  readonly refresh = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        vehicle: {
          ...state.vehicle,
          isUpdating: true,
        },
        dtcGroup: {
          ...state.dtcGroup,
          isUpdating: true,
        },
        fleetOverview: {
          ...state.fleetOverview,
          isUpdating: true,
        },
        batteryHealth: {
          ...state.batteryHealth,
          isUpdating: true,
        },
        powertrainAnomaly: {
          ...state.powertrainAnomaly,
          isUpdating: true,
        },
      }));
      return combineLatest([
        this.vehicleService.getByVin(vin).pipe(
          tapResponse(
            (next) => {
              this.patchState((state) => ({
                vehicle: {
                  ...state.vehicle,
                  data: next.data,
                  isUpdating: false,
                },
              }));
            },
            () => {
              this.patchState((state) => ({
                vehicle: {
                  ...state.vehicle,
                  isUpdating: false,
                },
              }));
            }
          )
        ),
        this.fleetService.fetchOneFleetOverview(vin).pipe(
          tapResponse(
            (next) => {
              this.patchState((state) => ({
                fleetOverview: {
                  ...state.fleetOverview,
                  data: next.data,
                  isUpdating: false,
                },
              }));
            },
            () => {
              this.patchState((state) => ({
                fleetOverview: {
                  ...state.fleetOverview,
                  isUpdating: false,
                },
              }));
            }
          )
        ),
        this.dtcCategoryGroupService.getDtcTemplateGroups(vin).pipe(
          tapResponse(
            ({ data }) => {
              this.patchState((state) => ({
                dtcGroup: {
                  ...state.dtcGroup,
                  data: data,
                  isUpdating: false,
                },
              }));
            },
            () => {
              this.patchState((state) => ({
                dtcGroup: {
                  ...state.dtcGroup,
                  isUpdating: false,
                },
              }));
            }
          )
        ),
        this.batteryHealthService.getBatteryStatus(vin).pipe(
          tapResponse(
            (next) => {
              this.patchState((state) => ({
                batteryHealth: {
                  ...state.batteryHealth,
                  data: next.data,
                  isUpdating: false,
                },
              }));
            },
            () => {
              this.patchState((state) => ({
                batteryHealth: {
                  ...state.batteryHealth,
                  isUpdating: false,
                },
              }));
            }
          )
        ),
        this.paService.getLatestPowertrainAnomaly(vin).pipe(
          tapResponse(
            (next) => {
              this.patchState((state) => ({
                powertrainAnomaly: {
                  ...state.powertrainAnomaly,
                  data: next.data,
                  isUpdating: false,
                },
              }));
            },
            () => {
              this.patchState((state) => ({
                powertrainAnomaly: {
                  ...state.powertrainAnomaly,
                  isUpdating: false,
                },
              }));
            }
          )
        ),
      ]);
    })
  );
}
