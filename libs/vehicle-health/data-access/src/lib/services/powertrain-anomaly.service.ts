import { HttpClient } from '@angular/common/http';
import {
  ApiResponseModel,
  PowertrainAnomaly,
  PowertrainAnomalyHistory,
} from '@cps/types';

export class PowertrainAnomalyService {
  constructor(
    private apiUrl: string,
    private http: HttpClient
  ) {}

  getLatestPowertrainAnomaly(vin: string) {
    return this.http.post<ApiResponseModel<PowertrainAnomaly>>(
      `${this.apiUrl}/powertrain-anomalies/latest/get`,
      {
        vin,
      }
    );
  }
  getPowertrainAnomalyHistory(vin: string) {
    return this.http.post<ApiResponseModel<PowertrainAnomalyHistory>>(
      `${this.apiUrl}/powertrain-anomalies/history/get`,
      {
        vin,
      }
    );
  }
}
