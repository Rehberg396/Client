import { HttpClient } from '@angular/common/http';
import {
  ApiResponseModel,
  FleetOverview,
  PagingResponseModel,
  QueryParams,
} from '@cps/types';

export class FleetService {
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private http: HttpClient
  ) {
    this.baseUrl = `${baseUrl}/fleets`;
  }

  fetchFleetOverview(queryParams: QueryParams) {
    return this.http.get<ApiResponseModel<PagingResponseModel<FleetOverview>>>(
      `${this.baseUrl}/overview`,
      {
        params: { ...queryParams },
      }
    );
  }

  fetchOneFleetOverview(vin: string) {
    return this.http.post<ApiResponseModel<FleetOverview>>(
      `${this.baseUrl}/overview/get`,
      {
        vin,
      }
    );
  }
}
