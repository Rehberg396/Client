import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ApiResponseModel,
  PowertrainAnomaly,
  PowertrainAnomalyHistory
} from '@cps/types';
import { PowertrainAnomalyService } from './powertrain-anomaly.service';

describe(PowertrainAnomalyService.name, () => {
  const url = 'https://api-server.com';
  let service: PowertrainAnomalyService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    const http = TestBed.inject(HttpClient);
    service = new PowertrainAnomalyService(url, http);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getPowertrainAnomalyHistory', () => {
    it('shoud call api with success', (done) => {
      const vin = 'abc';
      const mockResponse: ApiResponseModel<PowertrainAnomalyHistory> = {
        code: 'SUCCESS',
        data: {
          oilHistories: [],
          coolantHistories: [],
        },
        timestamp: new Date().toISOString(),
      };
      service.getPowertrainAnomalyHistory(vin).subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });

      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/powertrain-anomalies/history/get` && request.body.vin === vin
        );
      }, 'Request to load the anomaly data');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('shoud call api with error', (done) => {
      const vin = 'abc';
      service.getPowertrainAnomalyHistory(vin).subscribe({
        error: (response: HttpErrorResponse) => {
          expect(response.status).toBe(500);
          expect(response.statusText).toBe('Internal Server Error');
          expect(response.error).toBe('Failed!');
          done();
        },
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/powertrain-anomalies/history/get` && request.body.vin === vin
        );
      }, 'Request to load the anomaly data');
      expect(req.request.method).toBe('POST');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('getLatestPowertrainAnomaly', () => {
    it('shoud call api with success', (done) => {
      const vin = 'abc';
      const mockResponse: ApiResponseModel<PowertrainAnomaly> = {
        code: 'SUCCESS',
        data: {
          coolantStatus: 0,
          oilStatus: 0,
          coolantTimestamp: '',
          oilTimestamp: '',
          vin: '',
        },
        timestamp: new Date().toISOString(),
      };
      service.getLatestPowertrainAnomaly(vin).subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/powertrain-anomalies/latest/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the latest latest anomaly data');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('shoud call api successfully with no data', (done) => {
      const vin = 'abc';
      const mockResponse: ApiResponseModel<PowertrainAnomaly | null> = {
        code: 'SUCCESS',
        data: null,
        timestamp: new Date().toISOString(),
      };
      service.getLatestPowertrainAnomaly(vin).subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/powertrain-anomalies/latest/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the latest anomaly status');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('shoud call api with error', (done) => {
      const vin = 'abc';
      service.getLatestPowertrainAnomaly(vin).subscribe({
        error: (response: HttpErrorResponse) => {
          expect(response.status).toBe(500);
          expect(response.statusText).toBe('Internal Server Error');
          expect(response.error).toBe('Failed!');
          done();
        },
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/powertrain-anomalies/latest/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the latest anomaly data');
      expect(req.request.method).toBe('POST');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
