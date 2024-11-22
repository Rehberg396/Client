import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FaultDismissRequest, QueryParams, Vehicle } from '@cps/types';
import { VehicleService } from './vehicle.service';

describe(VehicleService.name, () => {
  let service: VehicleService;
  const httpClientMocked = {
    get: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
  };
  const vehicle: Vehicle = {
    vin: 'vin1',
    name: 'name1',
    manufacturerName: 'ddsds',
    modelLine: 'ddsds',
    modelType: 'ddsds',
    modelYear: '2022',
    engineType: 'xcx',
    vehicleProperties: [],
    licensePlate: '',
  };
  const apiUrl = 'https://example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: VehicleService,
          useFactory: () => {
            return new VehicleService(
              apiUrl,
              httpClientMocked as unknown as HttpClient
            );
          },
        },
      ],
    });

    service = TestBed.inject(VehicleService);
  });

  it('should invoke get()', () => {
    const params: QueryParams = {
      search: '',
      page: 0,
      size: 10,
    };
    service.get(params);

    expect(httpClientMocked.get).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/search`,
      {
        params: {
          ...params,
        },
      }
    );
  });

  it('should call add()', () => {
    service.add(vehicle);
    expect(service).toBeTruthy();
  });

  it('should call edit()', () => {
    service.edit(vehicle);
    expect(service).toBeTruthy();
  });

  it('should call delete()', () => {
    service.delete(vehicle.vin);
    expect(httpClientMocked.post).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/delete`,
      {
        vin: vehicle.vin,
      }
    );
  });

  it('should call getByVin()', () => {
    service.getByVin(vehicle.vin);
    expect(httpClientMocked.post).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/get`,
      { vin: vehicle.vin }
    );
  });

  it('should request get fault data with filter', () => {
    const query = {
      sort: 'name,asc',
      name: '',
      page: 0,
      size: 0,
    };
    service.getVehicleFaultWithFilter(vehicle.vin, query);
    expect(httpClientMocked.post).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/faults`,
      {
        vin: vehicle.vin,
      },
      {
        params: query,
      }
    );
  });

  it('should request get fault data without filter', () => {
    const query = {
      sort: 'name,asc',
      name: '',
      page: 0,
      size: 0,
    };
    service.getVehicleFaultWithFilter(vehicle.vin, query);
    expect(httpClientMocked.post).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/faults`,
      {
        vin: vehicle.vin,
      },
      {
        params: query,
      }
    );
  });

  it('should getVehicleFault with sort param empty if not exist sort name', () => {
    const query = {
      name: 'name',
      page: 0,
      size: 10,
      sort: 'name,asc',
    };

    service.getVehicleFault(query);
    expect(httpClientMocked.get).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/faults`,
      {
        params: query,
      }
    );
  });

  it('should getVehicleConnectivityStatus', () => {
    service.getConnectivityStatus();
    expect(httpClientMocked.get).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/connectivity-statuses`
    );
  });

  it('should call api post dismissFault', () => {
    const dismissRequest: FaultDismissRequest = {
      faultDateTime: '2001-22-11',
      dtcCode: 'dtcCode',
      protocolStandard: 'proto',
      vin: 'vin',
    };
    service.dismissFault(dismissRequest);
    expect(httpClientMocked.post).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/faults`,
      dismissRequest,
      {
        params: {
          command: 'dismiss',
        },
      }
    );
  });

  it('should call api getEngineTypes', () => {
    service.getEngineTypes();
    expect(httpClientMocked.get).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/engineTypes`
    );
  });

  it('should call api getFaultHistoriesByVin', () => {
    const start = new Date().toJSON();
    const params = {
      vin: 'test',
      start: start,
      dtcCode: 'test',
      faultOrigin: 'test',
      oem: 'test',
      protocolStandard: 'test',
    };
    service.getFaultHistoriesByVin(params);
    expect(httpClientMocked.post).toHaveBeenCalledWith(
      `${apiUrl}/vehicles/faults/history`,
      params
    );
  });
});
