import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  LoadingHandler,
  PagingResponseModel,
  QueryParams,
  RequestStatus,
  Vehicle,
} from '@cps/types';
import { ToastService } from '@cps/ui';
import { ComponentStoreWithSelectors } from '@cps/util';
import { VehicleService } from '@cps/vehicle-health/data-access';
import { OnStateInit, OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';

interface VehicleState {
  vehicles: RequestStatus<PagingResponseModel<Vehicle>>;
  engineTypes: string[];
}

const initialState: VehicleState = {
  vehicles: {
    loadingState: 'initial',
  },
  engineTypes: [],
};

@Injectable()
export class VehicleStore
  extends ComponentStoreWithSelectors<VehicleState>
  implements OnStoreInit, OnStateInit
{
  private readonly vehicleService = inject(VehicleService);
  private readonly toastService = inject(ToastService);

  ngrxOnStoreInit(): void {
    this.setState(initialState);
  }

  ngrxOnStateInit(): void {
    this.loadEngineTypes();
  }

  private handleError(error: HttpErrorResponse): void {
    const errorMsg = error.error.message || $localize`Internal Server Error`;
    this.toastService.error(errorMsg);
    this.patchState((s) => ({
      vehicles: {
        ...s.vehicles,
        loadingState: 'error',
        message: errorMsg,
      },
    }));
  }

  readonly searchVehicles = this.effect<QueryParams>(
    switchMap((queryParams) => {
      this.patchState((s) => ({
        vehicles: {
          ...s.vehicles,
          loadingState: 'loading',
        },
      }));
      return this.vehicleService.get(queryParams).pipe(
        tapResponse(
          (res) => {
            this.patchState({
              vehicles: {
                ...res.data,
                loadingState: 'loaded',
                data: res.data,
              },
            });
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        )
      );
    })
  );

  readonly loadEngineTypes = this.effect<void>(
    switchMap(() => {
      return this.vehicleService.getEngineTypes().pipe(
        tapResponse(
          (response) => {
            this.patchState({
              engineTypes: response.data,
            });
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        )
      );
    })
  );

  readonly deleteVehicle = this.effect<{
    vehicleVin: string;
    handler: LoadingHandler;
  }>(
    switchMap(({ vehicleVin, handler }) => {
      handler.handleLoading(true);
      return this.vehicleService.delete(vehicleVin).pipe(
        tapResponse(
          () => {
            handler.onSuccess();
            handler.handleLoading(false);
            const message = $localize`Delete successfully`;
            this.toastService.success(message);
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
            handler.handleLoading(false);
          }
        )
      );
    })
  );

  readonly editVehicle = this.effect<{
    vehicle: Omit<Vehicle, 'links' | 'id'>;
    handler: LoadingHandler;
  }>(
    switchMap(({ vehicle, handler }) => {
      handler.handleLoading(true);
      return this.vehicleService.edit(vehicle).pipe(
        tapResponse(
          () => {
            handler.onSuccess();
            handler.handleLoading(false);
            const message = $localize`Update successfully`;
            this.toastService.success(message);
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
            handler.handleLoading(false);
          }
        )
      );
    })
  );

  readonly createVehicle = this.effect<{
    vehicle: Vehicle;
    handler: LoadingHandler;
  }>(
    switchMap(({ vehicle, handler }) => {
      handler.handleLoading(true);
      this.patchState((s) => ({
        vehicles: {
          ...s.vehicles,
          isLoading: true,
        },
      }));
      return this.vehicleService.add(vehicle).pipe(
        tapResponse(
          () => {
            handler.onSuccess();
            handler.handleLoading(false);
            const message = $localize`Add successfully`;
            this.toastService.success(message);
          },
          (errorResponse: HttpErrorResponse) => {
            handler.handleLoading(false);
            if (errorResponse.error.code == 'VEHICLE_ALREADY_EXISTED') {
              handler.onError && handler.onError(errorResponse.error);
            } else {
              this.handleError(errorResponse);
            }
          }
        )
      );
    })
  );

  readonly deleteMany = this.effect<{
    vins: string[];
    handler: {
      handleLoading: (value: boolean) => void;
      done: (
        value: {
          vin: string;
          hasError: boolean;
          timestamp: string;
          code: string;
          reason: string;
        }[]
      ) => void;
    };
  }>(
    switchMap(({ vins, handler }) => {
      handler.handleLoading(true);
      return forkJoin(
        vins.map((vin) =>
          this.vehicleService.delete(vin).pipe(
            map((response) => ({
              timestamp: response.timestamp,
              code: response.code,
              hasError: false,
              reason: '',
            })),
            catchError((error: HttpErrorResponse) =>
              of({
                timestamp: error.error.timestamp,
                code: error.error.code,
                hasError: true,
                reason: error.error.message,
              })
            ),
            map((value) => ({
              vin,
              timestamp: value.timestamp,
              code: value.code,
              hasError: value.hasError,
              reason: value.reason,
            }))
          )
        )
      ).pipe(
        tap((value) => {
          handler.done(value);
          handler.handleLoading(false);
        })
      );
    })
  );
}
