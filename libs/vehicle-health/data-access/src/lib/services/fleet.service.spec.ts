import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpRequest,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ApiResponseModel,
  FleetOverview,
  PagingResponseModel,
} from '@cps/types';
import { FleetService } from './fleet.service';

describe(FleetService.name, () => {
  let fleetService: FleetService;
  let controller: HttpTestingController;
  const apiUrl = 'https://example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: FleetService,
          useFactory: (http: HttpClient) => {
            return new FleetService(apiUrl, http);
          },
          deps: [HttpClient],
        } as Provider,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    fleetService = TestBed.inject(FleetService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  describe('overview', () => {
    const httpParams = new HttpParams().append('search', 'vin==test');

    const httpRequest = new HttpRequest('GET', `${apiUrl}/fleets/overview`, {
      params: httpParams,
    });

    it('get all success', () => {
      const mockResponseData: ApiResponseModel<
        PagingResponseModel<FleetOverview>
      > = {
        data: {
          content: [
            {
              vin: 'vin',
            } as FleetOverview,
          ],
          page: {
            number: 0,
            size: 1,
            totalElements: 1,
            totalPages: 1,
          },
          links: [],
        },
        code: 'GET_FLEET_OVERVIEW_SUCCESS',
        timestamp: '',
      };

      fleetService
        .fetchFleetOverview({
          search: 'vin==test',
        })
        .subscribe((data) => {
          expect(data).toEqual(mockResponseData);
        });

      const req = controller.expectOne(
        (request) =>
          request.method === httpRequest.method &&
          request.urlWithParams === httpRequest.urlWithParams
      );
      req.flush(mockResponseData);
    });

    it('get all failure', () => {
      const errorMessage = $localize`Internal Server Error`;

      fleetService
        .fetchFleetOverview({
          search: 'vin==test',
        })
        .subscribe({
          next: () => fail('should have failed with the 500 error'),
          error: (error: HttpErrorResponse) => {
            expect(error.status).toEqual(500);
            expect(error.error).toEqual(errorMessage);
          },
        });

      const req = controller.expectOne(httpRequest.urlWithParams);

      req.flush(errorMessage, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('get one success', () => {
      const vin = 'vinTest';
      const mockResponseData: ApiResponseModel<FleetOverview> = {
        data: {
          vin: 'vin',
        } as FleetOverview,
        code: 'GET_FLEET_OVERVIEW_SUCCESS',
        timestamp: '',
      };

      fleetService.fetchOneFleetOverview(vin).subscribe((data) => {
        expect(data).toEqual(mockResponseData);
      });

      const req = controller.expectOne((request) => {
        return (
          request.url === `${apiUrl}/fleets/overview/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the one fleet overview');
      req.flush(mockResponseData);
    });

    it('get all failure', () => {
      const vin = 'vinTest';
      const errorMessage = $localize`Internal Server Error`;

      fleetService.fetchOneFleetOverview(vin).subscribe({
        next: () => fail('should have failed with the 500 error'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toEqual(500);
          expect(error.error).toEqual(errorMessage);
        },
      });
      const req = controller.expectOne((request) => {
        return (
          request.url === `${apiUrl}/fleets/overview/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the one fleet overview');
      req.flush(errorMessage, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
