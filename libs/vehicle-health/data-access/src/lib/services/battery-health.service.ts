import { HttpClient } from '@angular/common/http';
import { ApiResponseModel, BatteryStatus } from '@cps/types';

export class BatteryHealthService {
  constructor(
    private apiUrl: string,
    private http: HttpClient
  ) {}

  getBatteryStatus(vin: string) {
    return this.http.post<ApiResponseModel<BatteryStatus>>(
      `${this.apiUrl}/batteryHealths/get`,
      {
        vin,
      }
    );
  }

  getLatestBatteryStatus(vin: string) {
    return this.http.post<ApiResponseModel<BatteryStatus | null>>(
      `${this.apiUrl}/batteryHealths/latest/get`,
      {
        vin,
      }
    );
  }
}
