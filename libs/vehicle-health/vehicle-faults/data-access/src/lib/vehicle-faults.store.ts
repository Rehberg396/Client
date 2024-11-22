import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  FaultDismissInfo,
  PagingResponseModel,
  QueryParams,
  RequestStatus,
  RichVehicleFault,
  VehicleFaultHistory,
} from '@cps/types';
import { ToastService } from '@cps/ui';
import { ComponentStoreWithSelectors } from '@cps/util';
import { VehicleService } from '@cps/vehicle-health/data-access';
import { OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';

export interface VehicleFaultState {
  vehicleFaults: RequestStatus<PagingResponseModel<RichVehicleFault>>;
  vehicleFaultHistories: VehicleFaultHistory;
}

const initialState: VehicleFaultState = {
  vehicleFaultHistories: {
    histories: [],
    loading: false,
  },
  vehicleFaults: {
    loadingState: 'initial',
  },
};

@Injectable()
export class VehicleFaultStore
  extends ComponentStoreWithSelectors<VehicleFaultState>
  implements OnStoreInit
{
  private readonly vehicleService = inject(VehicleService);
  private readonly toastService = inject(ToastService);

  ngrxOnStoreInit() {
    this.setState(initialState);
  }

  readonly dismissFault = this.effect<{
    payload: FaultDismissInfo;
    onSuccess: () => void;
  }>(
    switchMap(({ payload, onSuccess }) =>
      this.vehicleService
        .dismissFault({
          vin: payload.vin,
          dtcCode: payload.dtcCode,
          protocolStandard: payload.protocolStandard,
          faultDateTime: payload.faultDateTime,
        })
        .pipe(
          tapResponse(
            () => {
              this.toastService.success($localize`Dismiss successfully`);
              onSuccess();
            },
            (error: HttpErrorResponse) => {
              const errorMsg =
                error.error.message || $localize`Internal Server Error`;
              this.toastService.error(errorMsg);
            }
          )
        )
    )
  );

  readonly getVehicleFaults = this.effect<{
    vin: string;
    queryParams: QueryParams;
  }>(
    switchMap(({ vin, queryParams }) => {
      this.patchState((s) => ({
        vehicleFaults: { ...s.vehicleFaults, loadingState: 'loading' },
      }));

      return this.vehicleService
        .getVehicleFaultWithFilter(vin, queryParams)
        .pipe(
          tapResponse(
            (response) => {
              this.patchState({
                vehicleFaults: {
                  loadingState: 'loaded',
                  data: {
                    content: response.data.content.map((e) => ({
                      ...e,
                      criticality: e.dtcTemplate.criticality,
                      recommendations: e.dtcTemplate.recommendations,
                      description: e.dtcTemplate.description,
                      possibleCause: e.dtcTemplate.possibleCause,
                      possibleSymptoms: e.dtcTemplate.symptom,
                    })),
                    page: {
                      number: response.data.page.number,
                      size: response.data.page.size,
                      totalElements: response.data.page.totalElements,
                      totalPages: response.data.page.totalPages,
                    },
                    links: response.data.links,
                  },
                },
              });
            },
            (error: HttpErrorResponse) => {
              const errorMsg =
                error.error.message || $localize`Internal Server Error`;
              this.toastService.error(errorMsg);
              this.patchState((s) => ({
                vehicleFaults: {
                  ...s.vehicleFaults,
                  loadingState: 'error',
                  message: errorMsg,
                },
              }));
            }
          )
        );
    })
  );

  readonly clearHistories = this.updater((state) => {
    return {
      ...state,
      vehicleFaultHistories: {
        histories: [],
        loading: false,
      },
    };
  });

  readonly loadHistories = this.effect<{
    vin: string;
    start: string;
    dtcCode: string;
    protocolStandard: string;
    oem: string;
    faultOrigin: string;
  }>(
    switchMap((fault) => {
      this.patchState((state) => ({
        vehicleFaultHistories: {
          ...state.vehicleFaultHistories,
          loading: true,
        },
      }));
      return this.vehicleService
        .getFaultHistoriesByVin({
          vin: fault.vin,
          start: fault.start,
          dtcCode: fault.dtcCode,
          protocolStandard: fault.protocolStandard,
          oem: fault.oem,
          faultOrigin: fault.faultOrigin,
        })
        .pipe(
          tapResponse(
            (response) => {
              this.patchState({
                vehicleFaultHistories: {
                  histories: response.data,
                  loading: false,
                },
              });
            },
            (error: HttpErrorResponse) => {
              this.patchState({
                vehicleFaultHistories: {
                  histories: [],
                  loading: false,
                },
              });
              const errorMsg =
                error.error.message || $localize`Internal Server Error`;
              this.toastService.error(errorMsg);
            }
          )
        );
    })
  );
}
