import { Injectable, inject } from '@angular/core';
import {
  DtcTemplateService,
  VehicleService,
} from '@cps/vehicle-health/data-access';
import { ToastService } from '@cps/ui';
import { ComponentStoreWithSelectors } from '@cps/util';
import {
  DtcTemplate,
  LoadingHandler,
  PagingResponseModel,
  QueryParams,
  RequestStatus,
} from '@cps/types';
import { OnStateInit, OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface DtcDashboardState {
  dtcTemplatePage: RequestStatus<PagingResponseModel<DtcTemplate>>;
  risks: string[];
  criticalities: string[];
  engineTypes: string[];
}

const initialState: DtcDashboardState = {
  dtcTemplatePage: {
    loadingState: 'initial',
  },
  risks: [],
  criticalities: [],
  engineTypes: [],
};

@Injectable()
export class DtcTemplateStore
  extends ComponentStoreWithSelectors<DtcDashboardState>
  implements OnStateInit, OnStoreInit
{
  private readonly dtcTemplateService = inject(DtcTemplateService);
  private readonly toastService = inject(ToastService);
  private readonly vehicleService = inject(VehicleService);

  criticalities$ = this.selectors.criticalities$;
  engineTypes$ = this.selectors.engineTypes$;

  ngrxOnStoreInit(): void {
    this.setState(initialState);
  }

  ngrxOnStateInit(): void {
    this.loadCriticalities();
    this.loadRisks();
    this.loadEngineTypes();
  }

  private handleError(error: HttpErrorResponse): void {
    const errorMsg = error.error.message || $localize`Internal Server Error`;
    this.toastService.error(errorMsg);
    this.patchState((s) => ({
      dtcTemplatePage: {
        ...s.dtcTemplatePage,
        loadingState: 'error',
        message: errorMsg,
      },
    }));
  }

  readonly searchDtcTemplates = this.effect<QueryParams>(
    switchMap((queryParams) => {
      this.patchState((state) => ({
        dtcTemplatePage: { ...state.dtcTemplatePage, loadingState: 'loading' },
      }));

      return this.dtcTemplateService.search(queryParams).pipe(
        tapResponse(
          (res) => {
            this.patchState({
              dtcTemplatePage: {
                data: res.data,
                loadingState: 'loaded',
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

  readonly delete = this.effect<{
    dtcData: DtcTemplate;
    handler: LoadingHandler;
  }>(
    switchMap(({ dtcData, handler }) => {
      handler.handleLoading(true);
      return this.dtcTemplateService.delete(dtcData).pipe(
        tapResponse(
          () => {
            this.toastService.success($localize`Delete successfully`);
            handler.onSuccess();
            handler.handleLoading(false);
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
            handler.handleLoading(false);
          }
        )
      );
    })
  );

  readonly edit = this.effect<{
    dtcData: DtcTemplate;
    handler: LoadingHandler;
  }>(
    switchMap(({ dtcData, handler }) => {
      handler.handleLoading(true);
      return this.dtcTemplateService.update(dtcData).pipe(
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

  readonly create = this.effect<{
    dtcData: DtcTemplate;
    handler: LoadingHandler;
  }>(
    switchMap(({ dtcData, handler }) => {
      handler.handleLoading(true);
      return this.dtcTemplateService.create(dtcData).pipe(
        tapResponse(
          () => {
            handler.handleLoading(false);
            handler.onSuccess();
            const message = $localize`Add successfully`;
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

  readonly loadCriticalities = this.effect<void>(
    switchMap(() => {
      return this.dtcTemplateService.getCriticalities().pipe(
        tapResponse(
          (response) => {
            this.patchState({
              criticalities: response.data,
            });
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        )
      );
    })
  );

  readonly loadRisks = this.effect<void>(
    switchMap(() =>
      this.dtcTemplateService.getRisks().pipe(
        tapResponse(
          (response) => {
            this.patchState({
              risks: response.data,
            });
          },
          (error: HttpErrorResponse) => {
            this.handleError(error);
          }
        )
      )
    )
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
}
