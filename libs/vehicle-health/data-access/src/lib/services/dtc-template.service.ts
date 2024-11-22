import { HttpClient } from '@angular/common/http';
import {
  ApiResponseModel,
  DtcTemplate,
  PagingResponseModel,
  QueryParams,
} from '@cps/types';

export class DtcTemplateService {
  private readonly baseUrl: string;

  constructor(
    baseUrl: string,
    private http: HttpClient
  ) {
    this.baseUrl = `${baseUrl}/dtcTemplates`;
  }

  create(dtc: DtcTemplate) {
    return this.http.post<ApiResponseModel<DtcTemplate>>(this.baseUrl, dtc);
  }

  delete(dtc: DtcTemplate) {
    return this.http.delete<ApiResponseModel<string>>(`${this.baseUrl}`, {
      params: {
        source: dtc.source,
        protocolStandard: dtc.protocolStandard,
        dtcCode: dtc.dtcCode,
        oem: dtc.oem,
        engineType: dtc.engineType,
      },
    });
  }

  update(dtc: DtcTemplate) {
    return this.http.put<ApiResponseModel<string>>(`${this.baseUrl}`, dtc);
  }

  search(queryParams: QueryParams) {
    return this.http.get<ApiResponseModel<PagingResponseModel<DtcTemplate>>>(
      `${this.baseUrl}/search`,
      {
        params: {
          ...queryParams,
        },
      }
    );
  }

  getCriticalities() {
    return this.http.get<ApiResponseModel<string[]>>(
      `${this.baseUrl}/criticalities`
    );
  }

  getRisks() {
    return this.http.get<ApiResponseModel<string[]>>(`${this.baseUrl}/risks`);
  }
}
