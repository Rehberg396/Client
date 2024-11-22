import { TestBed } from '@angular/core/testing';
import {
  ApiResponseModel,
  DtcTemplate,
  LoadingHandler,
  PagingResponseModel,
} from '@cps/types';
import { ToastService } from '@cps/ui';
import {
  DtcTemplateService,
  VehicleService,
} from '@cps/vehicle-health/data-access';
import { provideComponentStore } from '@ngrx/component-store';
import { filter, map, Observable, ReplaySubject, take } from 'rxjs';
import { DtcTemplateStore } from './dtc-template.store';

describe(DtcTemplateStore.name, () => {
  function setup() {
    const dtcTemplateResponse$ = new ReplaySubject<
      ApiResponseModel<PagingResponseModel<DtcTemplate>>
    >();
    const criticalities = new ReplaySubject<ApiResponseModel<string[]>>();
    const risks = new ReplaySubject<ApiResponseModel<string[]>>();
    const engineTypes = new ReplaySubject<ApiResponseModel<string[]>>();

    const dtcTemplateService = {
      search: () => dtcTemplateResponse$.asObservable(),
      getCriticalities: () => criticalities.asObservable(),
      getRisks: () => risks.asObservable(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    const toastService = {
      error: jest.fn(),
      success: jest.fn(),
    };

    const vehicleService = {
      getEngineTypes: () => engineTypes.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideComponentStore(DtcTemplateStore),
        { provide: DtcTemplateService, useValue: dtcTemplateService },
        { provide: ToastService, useValue: toastService },
        { provide: VehicleService, useValue: vehicleService },
      ],
    });

    const store = TestBed.inject(DtcTemplateStore);

    const loadingHandler: LoadingHandler = {
      handleLoading: jest.fn(),
      onSuccess: jest.fn(),
    };

    return {
      store,
      toastService,
      dtcTemplateResponse$,
      risks,
      engineTypes,
      criticalities,
      dtcTemplateService,
      loadingHandler,
    };
  }

  describe('search', () => {
    it('success', () => {
      const { store, dtcTemplateResponse$ } = setup();
      const mockResponse: ApiResponseModel<PagingResponseModel<DtcTemplate>> = {
        code: '',
        data: {
          content: [
            {
              id: '1',
            } as DtcTemplate,
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
      dtcTemplateResponse$.next(mockResponse);
      store.searchDtcTemplates({});
      store.selectors.dtcTemplatePage$
        .pipe(
          take(1),
          filter((d) => d.loadingState === 'loaded'),
          map((d) => d.data)
        )
        .subscribe((data) => {
          expect(data).toEqual(mockResponse.data);
        });
    });

    it('error', () => {
      const { store, toastService, dtcTemplateResponse$ } = setup();
      dtcTemplateResponse$.error({ error: {} });
      store.searchDtcTemplates({});
      expect(toastService.error).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('error', () => {
      const { store, dtcTemplateService, toastService, loadingHandler } =
        setup();
      dtcTemplateService.create.mockReturnValue(
        new Observable((obs) =>
          obs.error({ error: { message: 'create failed' } })
        )
      );
      store.create({
        dtcData: {} as DtcTemplate,
        handler: loadingHandler,
      });
      expect(toastService.error).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
    });

    it('success', () => {
      const { store, dtcTemplateService, toastService, loadingHandler } =
        setup();
      dtcTemplateService.create.mockReturnValue(
        new Observable((obs) => obs.next())
      );
      store.create({
        dtcData: {} as DtcTemplate,
        handler: loadingHandler,
      });
      expect(toastService.success).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
      expect(loadingHandler.onSuccess).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('error', () => {
      const { store, dtcTemplateService, toastService, loadingHandler } =
        setup();
      dtcTemplateService.update.mockReturnValue(
        new Observable((obs) =>
          obs.error({ error: { message: 'update failed' } })
        )
      );
      store.edit({
        dtcData: {} as DtcTemplate,
        handler: loadingHandler,
      });
      expect(toastService.error).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
    });

    it('success', () => {
      const { store, dtcTemplateService, toastService, loadingHandler } =
        setup();
      dtcTemplateService.update.mockReturnValue(
        new Observable((obs) => obs.next())
      );
      store.edit({
        dtcData: {} as DtcTemplate,
        handler: loadingHandler,
      });
      expect(toastService.success).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
      expect(loadingHandler.onSuccess).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('success', () => {
      const { store, toastService, dtcTemplateService, loadingHandler } =
        setup();
      dtcTemplateService.delete.mockImplementation(
        () =>
          new Observable((sub) => {
            sub.next({});
            sub.complete();
          })
      );
      store.delete({
        dtcData: {} as DtcTemplate,
        handler: loadingHandler,
      });
      expect(toastService.success).toHaveBeenCalled();
      expect(loadingHandler.handleLoading).toHaveBeenCalledTimes(2);
      expect(loadingHandler.onSuccess).toHaveBeenCalled();
    });

    it('error', () => {
      const { store, dtcTemplateService, toastService, loadingHandler } =
        setup();
      dtcTemplateService.delete.mockImplementation(
        () =>
          new Observable((sub) =>
            sub.error({ error: { message: 'delete failed' } })
          )
      );
      store.delete({
        dtcData: {} as DtcTemplate,
        handler: loadingHandler,
      });
      expect(toastService.error).toHaveBeenCalled();
    });
  });

  describe('load criticalities', () => {
    it('success', () => {
      const { store, criticalities } = setup();
      const res = ['a', 'b'];
      criticalities.next({
        code: 'SUCCESS',
        data: res,
        timestamp: new Date().toJSON(),
      });
      store.loadCriticalities();
      store.selectors.criticalities$.subscribe((data) => {
        expect(data).toEqual(res);
      });
    });

    it('error', () => {
      const { store, criticalities, toastService } = setup();
      criticalities.error({ error: { message: 'test' } });
      store.loadCriticalities();
      expect(toastService.error).toHaveBeenCalled();
    });
  });

  describe('load risks', () => {
    it('success', () => {
      const { store, risks } = setup();
      const res = ['a', 'b'];
      risks.next({
        code: 'SUCCESS',
        data: res,
        timestamp: new Date().toJSON(),
      });
      store.loadRisks();
      store.selectors.risks$.subscribe((data) => {
        expect(data).toEqual(res);
      });
    });

    it('error', () => {
      const { store, risks, toastService } = setup();
      risks.error({ error: { message: 'test' } });
      store.loadRisks();
      expect(toastService.error).toHaveBeenCalledWith('test');
    });
  });

  describe('load engineTypes', () => {
    it('success', () => {
      const { store, engineTypes } = setup();
      const res = ['a', 'b'];
      engineTypes.next({
        code: 'SUCCESS',
        data: res,
        timestamp: new Date().toJSON(),
      });
      store.loadEngineTypes();
      store.selectors.engineTypes$.subscribe((data) => {
        expect(data).toEqual(res);
      });
    });

    it('error', () => {
      const { store, engineTypes, toastService } = setup();
      engineTypes.error({ error: {} });
      store.loadEngineTypes();
      expect(toastService.error).toHaveBeenCalled();
    });
  });
});
