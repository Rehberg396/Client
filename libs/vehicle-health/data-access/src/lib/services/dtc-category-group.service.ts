import { HttpClient } from '@angular/common/http';
import { ApiResponseModel, DtcTemplateGroup } from '@cps/types';

export class DtcCategoryGroupService {
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private http: HttpClient
  ) {
    this.baseUrl = `${baseUrl}/dtcCategoryGroup`;
  }

  getDtcTemplateGroups(vin: string) {
    return this.http.post<ApiResponseModel<DtcTemplateGroup[]>>(
      `${this.baseUrl}/get`,
      {
        vin,
      }
    );
  }
}
