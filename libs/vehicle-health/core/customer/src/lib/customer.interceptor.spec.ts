import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { X_CUSTOMER } from './customer.const';
import { CustomerInterceptor } from './customer.interceptor';
import { CustomerService } from './customer.service';

describe(CustomerInterceptor.name, () => {
  let http: HttpClient;
  let httpController: HttpTestingController;
  let customerContext: jest.Mock<string | undefined>;
  const server1 = 'https://api-server-1.com';
  const server2 = 'https://api-server-2.com';

  beforeEach(() => {
    customerContext = jest.fn();
    const customerService = {
      customerContext,
    } as unknown as CustomerService;

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useValue: new CustomerInterceptor(customerService, [
            server1,
            server2,
          ]),
          multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('request to known servers', () => {
    it('should add X-Customer header to the request when request to server 1', () => {
      const mockRequestUrl = `${server1}/test`;
      customerContext.mockReturnValue('Customer 1');
      lastValueFrom(http.get(mockRequestUrl));
      const request = httpController.expectOne(mockRequestUrl);
      expect(request.request.headers.get(X_CUSTOMER)).toBe('Customer 1');
    });

    it('should add X-Customer header to the request when request to server 2', () => {
      const mockRequestUrl = `${server2}/test`;
      customerContext.mockReturnValue('Customer 2');
      lastValueFrom(http.get(mockRequestUrl));
      const request = httpController.expectOne(mockRequestUrl);
      expect(request.request.headers.get(X_CUSTOMER)).toBe('Customer 2');
    });

    it('should do nothing when request to server 2 but there is no customer context', () => {
      const mockRequestUrl = `${server2}/test`;
      customerContext.mockReturnValue(undefined);
      lastValueFrom(http.get(mockRequestUrl));
      const request = httpController.expectOne(mockRequestUrl);
      expect(request.request.headers.get(X_CUSTOMER)).toBeNull();
    });
  });

  describe('request to other api server', () => {
    it('should do nothing when request to other server', () => {
      const mockRequestUrl = `https://other-api-server.com/test`;
      lastValueFrom(http.get(mockRequestUrl));
      const request = httpController.expectOne(mockRequestUrl);
      expect(request.request.headers.get(X_CUSTOMER)).toBeNull();
    });
  });
});
