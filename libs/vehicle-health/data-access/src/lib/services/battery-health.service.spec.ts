import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BatteryHealthService } from './battery-health.service';
import { ApiResponseModel, BatteryStatus } from '@cps/types';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';

describe(BatteryHealthService.name, () => {
  const url = 'https://api-server.com';
  let batteryHealthService: BatteryHealthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpTesting = TestBed.inject(HttpTestingController);
    const http = TestBed.inject(HttpClient);
    batteryHealthService = new BatteryHealthService(url, http);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getBatteryStatus', () => {
    it('shoud call api with success', (done) => {
      const vin = 'abc';
      const mockResponse: ApiResponseModel<BatteryStatus> = {
        code: 'SUCCESS',
        data: {
          category: 'G',
          recommendation: 'X',
          sohStatus: 1,
          sohValue: 1,
          timestamp: new Date().toISOString(),
          vin: 'VIN',
        },
        timestamp: new Date().toISOString(),
      };
      batteryHealthService.getBatteryStatus(vin).subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });

      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/batteryHealths/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the battery status');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('shoud call api with error', (done) => {
      const vin = 'abc';
      batteryHealthService.getBatteryStatus(vin).subscribe({
        error: (response: HttpErrorResponse) => {
          expect(response.status).toBe(500);
          expect(response.statusText).toBe('Internal Server Error');
          expect(response.error).toBe('Failed!');
          done();
        },
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/batteryHealths/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the battery status');
      expect(req.request.method).toBe('POST');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('getLatestBatteryStatus', () => {
    it('shoud call api with success', (done) => {
      const vin = 'abc';
      const mockResponse: ApiResponseModel<BatteryStatus> = {
        code: 'SUCCESS',
        data: {
          category: 'G',
          recommendation: 'X',
          sohStatus: 1,
          sohValue: 1,
          timestamp: new Date().toISOString(),
          vin: 'VIN',
        },
        timestamp: new Date().toISOString(),
      };
      batteryHealthService.getLatestBatteryStatus(vin).subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/batteryHealths/latest/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the latest battery status');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('shoud call api successfully with no data', (done) => {
      const vin = 'abc';
      const mockResponse: ApiResponseModel<BatteryStatus | null> = {
        code: 'SUCCESS',
        data: null,
        timestamp: new Date().toISOString(),
      };
      batteryHealthService.getLatestBatteryStatus(vin).subscribe((next) => {
        expect(mockResponse).toEqual(next);
        done();
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/batteryHealths/latest/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the latest battery status');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('shoud call api with error', (done) => {
      const vin = 'abc';
      batteryHealthService.getLatestBatteryStatus(vin).subscribe({
        error: (response: HttpErrorResponse) => {
          expect(response.status).toBe(500);
          expect(response.statusText).toBe('Internal Server Error');
          expect(response.error).toBe('Failed!');
          done();
        },
      });
      const req = httpTesting.expectOne((request) => {
        return (
          request.url === `${url}/batteryHealths/latest/get` &&
          request.body.vin === vin
        );
      }, 'Request to load the latest battery status');
      expect(req.request.method).toBe('POST');
      req.flush('Failed!', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
