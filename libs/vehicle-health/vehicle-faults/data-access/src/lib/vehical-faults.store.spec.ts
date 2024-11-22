import { TestBed } from '@angular/core/testing';
import {
  ApiResponseModel,
  DtcTemplate,
  PagingResponseModel,
  RichVehicleFault,
  VehicleFault,
} from '@cps/types';
import { ToastService } from '@cps/ui';
import { VehicleService } from '@cps/vehicle-health/data-access';
import { provideComponentStore } from '@ngrx/component-store';
import { ReplaySubject } from 'rxjs';
import { VehicleFaultStore } from './vehicle-faults.store';

describe(VehicleFaultStore.name, () => {
  const fault1 = {
    start: new Date().toJSON(),
    end: new Date().toJSON(),
    faultDateTime: new Date().toJSON(),
    status: 'pending',
    dtcCode: 'dtcCode1',
    faultOrigin: 'faultOrigin1',
    description: 'description1',
    possibleCause: 'possibleCause1',
    possibleSymptoms: 'possibleSymptoms1',
    criticality: 'criticality1',
    recommendations: [],
    oem: 'oem1',
    protocolStandard: 'protocolStandard1',
    dtcTemplate: {
      criticality: 'test',
      recommendations: ['test'],
      description: 'test',
      possibleCause: 'test',
      symptom: 'test',
    } as DtcTemplate,
    vehicleName: '1',
    vin: '1',
  };

  function setup() {
    const vehicleFaultsSubject = new ReplaySubject<
      ApiResponseModel<PagingResponseModel<RichVehicleFault>>
    >();
    const dismissSubject = new ReplaySubject<ApiResponseModel<null>>();
    const faultHistorySubject = new ReplaySubject<
      ApiResponseModel<VehicleFault[]>
    >();

    const mockVehicleService = {
      getVehicleFaultWithFilter: jest.fn(),
      getFaultHistoriesByVin: jest.fn(),
      dismissFault: jest.fn(),
    };

    mockVehicleService.getVehicleFaultWithFilter.mockImplementation(() =>
      vehicleFaultsSubject.asObservable()
    );

    mockVehicleService.getFaultHistoriesByVin.mockImplementation(() =>
      faultHistorySubject.asObservable()
    );

    mockVehicleService.dismissFault.mockImplementation(() =>
      dismissSubject.asObservable()
    );

    const mockToastService = {
      error: jest.fn(),
      success: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideComponentStore(VehicleFaultStore),
        { provide: VehicleService, useValue: mockVehicleService },
        { provide: ToastService, useValue: mockToastService },
      ],
    });

    const store = TestBed.inject(VehicleFaultStore);
    jest.spyOn(store, 'patchState');
    return {
      store,
      mockToastService,
      vehicleFaultsSubject,
      mockVehicleService,
      dismissSubject,
      faultHistorySubject,
    };
  }

  describe('dismissFault', () => {
    it('success', () => {
      const { store, mockVehicleService, mockToastService, dismissSubject } =
        setup();
      dismissSubject.next({
        code: 'success',
        data: null,
        timestamp: '',
      });
      const mockData = {
        vin: 'vin',
        dtcCode: 'dtcCode',
        protocolStandard: 'protocolStandard',
        faultDateTime: 'faultDateTime',
        status: 'inactive',
        other: 'test',
      };
      const onSuccess = jest.fn();
      store.dismissFault({ payload: mockData, onSuccess });

      expect(mockVehicleService.dismissFault).toHaveBeenCalledWith({
        vin: 'vin',
        dtcCode: 'dtcCode',
        protocolStandard: 'protocolStandard',
        faultDateTime: 'faultDateTime',
      });
      expect(mockToastService.success).toHaveBeenCalledWith(
        'Dismiss successfully'
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    it('error', () => {
      const { store, mockToastService, dismissSubject } = setup();
      dismissSubject.error({ error: { message: 'test' } });
      const mockData = {
        vin: 'vin',
        dtcCode: 'dtcCode',
        protocolStandard: 'protocolStandard',
        faultDateTime: 'faultDateTime',
        status: 'inactive',
        other: 'test',
      };
      const onSuccess = jest.fn();
      store.dismissFault({ payload: mockData, onSuccess });

      expect(mockToastService.error).toHaveBeenCalledWith('test');
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('internal server error', () => {
      const { store, mockToastService, dismissSubject } = setup();
      dismissSubject.error({ error: {} });
      const mockData = {
        vin: 'vin',
        dtcCode: 'dtcCode',
        protocolStandard: 'protocolStandard',
        faultDateTime: 'faultDateTime',
        status: 'inactive',
        other: 'test',
      };
      const onSuccess = jest.fn();
      store.dismissFault({ payload: mockData, onSuccess });

      expect(mockToastService.error).toHaveBeenCalledWith(
        'Internal Server Error'
      );
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  describe('loadHistories', () => {
    it('success', () => {
      const { store, faultHistorySubject } = setup();
      faultHistorySubject.next({
        code: 'success',
        data: [],
        timestamp: '',
      });
      store.loadHistories({
        vin: 'vin1',
        start: new Date().toJSON(),
        dtcCode: 'test',
        faultOrigin: 'test',
        oem: 'test',
        protocolStandard: 'test',
      });
      expect(store.patchState).toHaveBeenCalledWith({
        vehicleFaultHistories: {
          histories: [],
          loading: false,
        },
      });
    });

    it('error', () => {
      const { store, mockToastService, faultHistorySubject } = setup();
      faultHistorySubject.error({ error: 'test' });
      store.loadHistories({
        vin: 'vin1',
        start: new Date().toJSON(),
        dtcCode: 'test',
        faultOrigin: 'test',
        oem: 'test',
        protocolStandard: 'test',
      });
      expect(store.patchState).toHaveBeenCalledWith({
        vehicleFaultHistories: {
          histories: [],
          loading: false,
        },
      });
      expect(mockToastService.error).toHaveBeenCalled();
    });

    it('internal error', () => {
      const { store, mockToastService, faultHistorySubject } = setup();
      faultHistorySubject.error({ error: {} });
      store.loadHistories({
        vin: 'vin1',
        start: new Date().toJSON(),
        dtcCode: 'test',
        faultOrigin: 'test',
        oem: 'test',
        protocolStandard: 'test',
      });
      expect(store.patchState).toHaveBeenCalledWith({
        vehicleFaultHistories: {
          histories: [],
          loading: false,
        },
      });
      expect(mockToastService.error).toHaveBeenCalledWith(
        'Internal Server Error'
      );
    });
  });

  describe('getVehicleFaults', () => {
    it('success', () => {
      const { store, vehicleFaultsSubject } = setup();
      vehicleFaultsSubject.next({
        code: 'success',
        data: {
          content: [fault1],
          links: [],
          page: {
            number: 0,
            size: 10,
            totalElements: 1,
            totalPages: 1,
          },
        },
        timestamp: '',
      });
      store.getVehicleFaults({ vin: 'vin1', queryParams: {} });
      expect(store.patchState).toHaveBeenCalledWith({
        vehicleFaults: {
          loadingState: 'loaded',
          data: {
            content: [
              {
                ...fault1,
                criticality: fault1.dtcTemplate.criticality,
                recommendations: fault1.dtcTemplate.recommendations,
                description: fault1.dtcTemplate.description,
                possibleCause: fault1.dtcTemplate.possibleCause,
                possibleSymptoms: fault1.dtcTemplate.symptom,
              },
            ],
            page: {
              number: 0,
              size: 10,
              totalElements: 1,
              totalPages: 1,
            },
            links: [],
          },
        },
      });
    });

    it('error', () => {
      const { store, mockToastService, vehicleFaultsSubject } = setup();
      vehicleFaultsSubject.error({ error: { error: {} } });
      store.getVehicleFaults({ vin: 'vin1', queryParams: {} });
      expect(mockToastService.error).toHaveBeenCalled();
    });

    it('internal error', () => {
      const { store, mockToastService, vehicleFaultsSubject } = setup();
      vehicleFaultsSubject.error({ error: { error: {} } });
      store.getVehicleFaults({ vin: 'vin1', queryParams: {} });
      expect(mockToastService.error).toHaveBeenCalledWith(
        'Internal Server Error'
      );
    });
  });

  describe('clearHistories', () => {
    it('should clear history', () => {
      const { store, vehicleFaultsSubject } = setup();
      vehicleFaultsSubject.error(new Error('test'));
      store.clearHistories();
      store.selectors.vehicleFaultHistories$.subscribe((d) => {
        expect(d).toEqual({
          histories: [],
          loading: false,
        });
      });
    });
  });
});
