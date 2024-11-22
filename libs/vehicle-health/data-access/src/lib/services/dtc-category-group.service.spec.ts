import {
  HttpClient,
  HttpRequest,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiResponseModel, DtcTemplateGroup } from '@cps/types';
import { DtcCategoryGroupService } from './dtc-category-group.service';

describe(DtcCategoryGroupService.name, () => {
  let dtcCategoryGroupService: DtcCategoryGroupService;
  let controller: HttpTestingController;

  const apiUrl = 'https://example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: DtcCategoryGroupService,
          useFactory: (http: HttpClient) => {
            return new DtcCategoryGroupService(apiUrl, http);
          },
          deps: [HttpClient],
        } as Provider,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    dtcCategoryGroupService = TestBed.inject(DtcCategoryGroupService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  describe('getDtcTemplateGroups', () => {
    it('should get success', (done) => {
      const response: ApiResponseModel<DtcTemplateGroup[]> = {
        data: [],
        code: 'GET_FLEET_OVERVIEW_SUCCESS',
        timestamp: new Date().toISOString(),
      };

      dtcCategoryGroupService.getDtcTemplateGroups('ABC').subscribe((data) => {
        expect(data).toEqual(response);
        done();
      });

      const httpRequest = new HttpRequest(
        'POST',
        `${apiUrl}/dtcCategoryGroup/get`,
        {
          vin: 'ABC',
        }
      );
      const req = controller.expectOne((request) => {
        return (
          request.method === httpRequest.method && request.body.vin === 'ABC'
        );
      });
      req.flush(response);
    });
  });
});
