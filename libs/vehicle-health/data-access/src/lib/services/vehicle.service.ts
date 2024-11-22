import { HttpClient } from '@angular/common/http';
import {
  ApiResponseModel,
  FaultDismissRequest,
  PagingResponseModel,
  QueryParams,
  Vehicle,
  VehicleConnectivityStatus,
  VehicleFault,
} from '@cps/types';

export class VehicleService {
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private http: HttpClient
  ) {
    this.baseUrl = `${baseUrl}/vehicles`;
  }

  get(queryParams: QueryParams) {
    return this.http.get<ApiResponseModel<PagingResponseModel<Vehicle>>>(
      `${this.baseUrl}/search`,
      {
        params: {
          ...queryParams,
        },
      }
    );
  }

  add(vehicle: Vehicle) {
    return this.http.post<ApiResponseModel<Vehicle>>(
      `${this.baseUrl}`,
      vehicle
    );
  }

  edit(vehicle: Partial<Vehicle>) {
    return this.http.put<ApiResponseModel<string>>(`${this.baseUrl}`, vehicle);
  }

  delete(vin: string) {
    return this.http.post<ApiResponseModel<string>>(`${this.baseUrl}/delete`, {
      vin,
    });
  }

  getByVin(vin: string) {
    return this.http.post<ApiResponseModel<Vehicle>>(`${this.baseUrl}/get`, {
      vin,
    });
  }

  getVehicleFaultWithFilter(vin: string, query: QueryParams) {
    return this.http.post<ApiResponseModel<PagingResponseModel<VehicleFault>>>(
      `${this.baseUrl}/faults`,
      {
        vin,
      },
      {
        params: {
          ...query,
        },
      }
    );
  }

  getVehicleFault(queryParams: QueryParams) {
    return this.http.get<ApiResponseModel<PagingResponseModel<VehicleFault>>>(
      `${this.baseUrl}/faults`,
      {
        params: {
          ...queryParams,
        },
      }
    );
  }

  getConnectivityStatus() {
    return this.http.get<ApiResponseModel<VehicleConnectivityStatus>>(
      `${this.baseUrl}/connectivity-statuses`
    );
  }

  dismissFault(dismissRequest: FaultDismissRequest) {
    return this.http.post<ApiResponseModel<void>>(
      `${this.baseUrl}/faults`,
      dismissRequest,
      {
        params: {
          command: 'dismiss',
        },
      }
    );
  }

  getEngineTypes() {
    return this.http.get<ApiResponseModel<string[]>>(
      `${this.baseUrl}/engineTypes`
    );
  }

  getFaultHistoriesByVin(params: {
    vin: string;
    start: string;
    dtcCode: string;
    protocolStandard: string;
    oem: string;
    faultOrigin: string;
  }) {
    return this.http.post<ApiResponseModel<VehicleFault[]>>(
      `${this.baseUrl}/faults/history`,
      {
        vin: params.vin,
        start: params.start,
        dtcCode: params.dtcCode,
        protocolStandard: params.protocolStandard,
        oem: params.oem,
        faultOrigin: params.faultOrigin,
      }
    );
  }
}
