import { TestBed } from '@angular/core/testing';
import { VehicleService } from '@cps/vehicle-health/data-access';
import {
  ApiResponseModel,
  LoadingHandler,
  PagingResponseModel,
  Vehicle,
} from '@cps/types';
import { ToastService } from '@cps/ui';
import { provideComponentStore } from '@ngrx/component-store';
import { Observable, of, ReplaySubject, take, throwError } from 'rxjs';
import { VehicleStore } from './vehicle.store';

describe(VehicleStore.name, () => {
  function setup() {
    const mockResponseVehicle$ = new ReplaySubject<
      ApiResponseModel<PagingResponseModel<Vehicle>>
    >();
    const engineTypesSubject = new ReplaySubject<ApiResponseModel<string[]>>();

    const mockVehicleService = {
      get: () => mockResponseVehicle$.asObservable(),
      add: jest.fn(),
      edit: jest.fn(),
      delete: jest.fn(),
      getEngineTypes: () => engineTypesSubject.asObservable(),
    };

    const mockToastService = {
      error: jest.fn(),
      success: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideComponentStore(VehicleStore),
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: ToastService, useValue: mockToastService },
      ],
    });
    const store = TestBed.inject(VehicleStore);
    const loadingHandler: LoadingHandler = {
      handleLoading: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    };
    return {
      store,
      mockToastService,
      mockResponseVehicle$,
      mockVehicleService,
      loadingHandler,
      engineTypesSubject,
    };
  }

  describe('searchVehicles', () => {
    it('success', (done) => {
      const { store, mockResponseVehicle$ } = setup();
      const mockResponse: ApiResponseModel<PagingResponseModel<Vehicle>> = {
        code: '',
        data: {
          content: [
            {
              vin: '1',
            } as Vehicle,
          ],
          links: [],
          page: {
            number: 0,
            size: 1,
            totalElements: 1,
            totalPages: 1,
          },
        },
        timestamp: '',
      };

      mockResponseVehicle$.next(mockResponse);
      store.searchVehicles({});
      store.selectors.vehicles$.pipe(take(1)).subscribe((next) => {
        expect(next.loadingState).toBe('loaded');
        done();
      });
    });

    it('fail', (done) => {
      const { store, mockResponseVehicle$ } = setup();
      mockResponseVehicle$.error({ error: {} });
      store.searchVehicles({});
      store.selectors.vehicles$.pipe(take(1)).subscribe((next) => {
        expect(next.loadingState).toBe('error');
        done();
      });
    });
  });

  describe('loadEngineTypes', () => {
    it('should patchState correctly', (done) => {
      const { store, engineTypesSubject } = setup();
      engineTypesSubject.next({
        data: ['a', 'b'],
        code: 'SUCCESS',
        timestamp: new Date().toJSON(),
      });
      store.loadEngineTypes();
      store.selectors.engineTypes$.subscribe((engineTypes) => {
        expect(engineTypes).toEqual(['a', 'b']);
        done();
      });
    });

    it('should show toast.error ', () => {
      const { store, engineTypesSubject, mockToastService } = setup();
      engineTypesSubject.error({ error: true });
      store.loadEngineTypes();
      expect(mockToastService.error).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should show toast.success after delete successfully', () => {
      const { store, mockVehicleService, mockToastService, loadingHandler } =
        setup();
      mockVehicleService.delete.mockReturnValue(
        new Observable((obs) => obs.next())
      );
      store.deleteVehicle({
        vehicleVin: 'test',
        handler: loadingHandler,
      });
      expect(mockToastService.success).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
      expect(loadingHandler.onSuccess).toHaveBeenCalled();
    });

    it('should show toast.error after delete failed', () => {
      const { store, mockVehicleService, mockToastService, loadingHandler } =
        setup();
      mockVehicleService.delete.mockReturnValue(
        new Observable((obs) => obs.error({ error: {} }))
      );
      store.deleteVehicle({
        vehicleVin: 'test',
        handler: loadingHandler,
      });
      expect(mockToastService.error).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should show toast.error after create failed', () => {
      const { store, mockVehicleService, mockToastService, loadingHandler } =
        setup();
      mockVehicleService.add.mockReturnValue(
        new Observable((obs) => obs.error({ error: { message: 'Test error' } }))
      );
      store.createVehicle({
        vehicle: {} as Vehicle,
        handler: loadingHandler,
      });
      expect(mockToastService.error).toHaveBeenCalled();
    });

    it('should callback handler.onError after create failed with VEHICLE_ALREADY_EXISTED', () => {
      const { store, mockVehicleService, loadingHandler } = setup();
      mockVehicleService.add.mockReturnValue(
        new Observable((obs) =>
          obs.error({
            error: {
              code: 'VEHICLE_ALREADY_EXISTED',
              message: 'Vehicle already existed',
            },
          })
        )
      );
      store.createVehicle({
        vehicle: {} as Vehicle,
        handler: loadingHandler,
      });
      expect(loadingHandler.onError).toHaveBeenCalled();
    });

    it('should show toast.success after create successfully', () => {
      const { store, mockVehicleService, mockToastService, loadingHandler } =
        setup();
      mockVehicleService.add.mockReturnValue(
        new Observable((obs) => obs.next())
      );
      store.createVehicle({
        vehicle: {} as Vehicle,
        handler: loadingHandler,
      });
      expect(mockToastService.success).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
      expect(loadingHandler.onSuccess).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should show toast.error after update failed', () => {
      const { store, mockVehicleService, mockToastService, loadingHandler } =
        setup();
      mockVehicleService.edit.mockReturnValue(
        new Observable((obs) => obs.error({ error: {} }))
      );
      store.editVehicle({
        vehicle: {} as Omit<Vehicle, 'id' | 'links'>,
        handler: loadingHandler,
      });
      expect(mockToastService.error).toHaveBeenCalled();
    });

    it('should show toast.success after update successfully', () => {
      const { store, mockVehicleService, mockToastService, loadingHandler } =
        setup();
      mockVehicleService.edit.mockReturnValue(
        new Observable((obs) => obs.next())
      );
      store.editVehicle({
        vehicle: {} as Omit<Vehicle, 'id' | 'links'>,
        handler: loadingHandler,
      });
      expect(mockToastService.success).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
      expect(loadingHandler.onSuccess).toHaveBeenCalled();
    });
  });

  describe('deleteMany', () => {
    it('should handle both sucess and error cases', () => {
      const { store, mockVehicleService } = setup();

      mockVehicleService.delete
        .mockReturnValueOnce(
          of({ code: 'SUCCESS', data: null, timestamp: '2024-01-01T00:00Z' })
        )
        .mockReturnValueOnce(
          throwError(() => ({
            error: {
              message: 'FAIL',
              timestamp: '2024-01-01T01:00Z',
              code: 'ERROR',
            },
          }))
        );

      const handler = {
        done: jest.fn(),
        handleLoading: jest.fn(),
      };

      store.deleteMany({
        vins: ['vin1', 'vin2'],
        handler,
      });

      expect(handler.handleLoading).toHaveBeenCalledTimes(2);
      expect(handler.done).toHaveBeenCalledWith([
        {
          code: 'SUCCESS',
          hasError: false,
          reason: '',
          timestamp: '2024-01-01T00:00Z',
          vin: 'vin1',
        },
        {
          vin: 'vin2',
          code: 'ERROR',
          hasError: true,
          reason: 'FAIL',
          timestamp: '2024-01-01T01:00Z',
        },
      ]);
    });
  });
});
