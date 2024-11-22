import { Injectable, inject } from '@angular/core';
import { DiagnosticStep, RequestStatus } from '@cps/types';
import { ToastService } from '@cps/ui';
import { ComponentStoreWithSelectors } from '@cps/util';
import { DiagnosticService } from '@cps/vehicle-health/data-access';
import { OnStoreInit } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { catchError, switchMap } from 'rxjs';

export type IsRunning = { isRunning?: boolean };

export interface DiagnosticState {
  diagnosticsSteps: RequestStatus<DiagnosticStep[]> & IsRunning;
}

const initialState: DiagnosticState = {
  diagnosticsSteps: {
    loadingState: 'initial',
    isRunning: false,
  },
};

@Injectable()
export class DiagnosticStore
  extends ComponentStoreWithSelectors<DiagnosticState>
  implements OnStoreInit
{
  private readonly diagnosticService = inject(DiagnosticService);
  private readonly toast = inject(ToastService);

  ngrxOnStoreInit(): void {
    const savedIsRunning = localStorage.getItem('isRunning');
    this.setState({
      diagnosticsSteps: {
        ...initialState.diagnosticsSteps,
        isRunning: savedIsRunning ? JSON.parse(savedIsRunning) : false,
      },
    });
  }

  readonly loadDiagnosticSteps = this.effect<string>(
    switchMap((vin) => {
      this.patchState((state) => ({
        diagnosticsSteps: {
          ...state.diagnosticsSteps,
          loadingState: 'loading',
        },
      }));

      return this.diagnosticService.getMockDiagnosticSteps(vin).pipe(
        tapResponse(
          (next) => {
            this.patchState({
              diagnosticsSteps: {
                data: next.data,
                loadingState: 'loaded',
              },
            });
          },
          (error: Error) => {
            this.patchState((state) => ({
              diagnosticsSteps: {
                ...state.diagnosticsSteps,
                loadingState: 'error',
                message: error.message,
              },
            }));
          },
        ),
      );
    }),
  );

  readonly startDiagnostic = this.effect<string | undefined>(
    switchMap((vin) => {
      if (!vin) {
        this.toast.error('Select a vehicle to start the diagnosis');
        return [];
      }

      this.patchState((state) => ({
        diagnosticsSteps: {
          ...state.diagnosticsSteps,
          isRunning: true,
          // loadingState: 'loading',
        },
      }));

      return this.diagnosticService.startDiagnostic().pipe(
        catchError((error) => {
          this.toast.error(error);
          return [];
        }),
        tapResponse(
          (next) => {
            this.patchState({
              diagnosticsSteps: {
                data: next,
                loadingState: 'loaded',
                isRunning: true,
              },
            });
          },
          (error: Error) => {
            this.toast.error(error.message);
            this.patchState((state) => ({
              diagnosticsSteps: {
                ...state.diagnosticsSteps,
                loadingState: 'error',
                isRunning: false,
                message: error.message,
              },
            }));
          },
        ),
      );
    }),
  );
}
