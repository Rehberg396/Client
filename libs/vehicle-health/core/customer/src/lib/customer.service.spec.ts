import { CustomerService, CustomerState } from './customer.service';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ApiResponseModel } from '@cps/types';

describe(CustomerService.name, () => {
  const apiUrl = 'https://api-server.example';
  let httpTesting: HttpTestingController;
  let http: HttpClient;
  let customerService: CustomerService;

  const storage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  const initState = (initialState?: CustomerState) => {
    customerService = new CustomerService(
      apiUrl,
      http,
      storage as unknown as Storage,
      initialState
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);

    initState();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('loadCurrent', () => {
    it('success with no customer in storage', async () => {
      storage.getItem.mockReturnValue(undefined);

      const response: ApiResponseModel<string[]> = {
        data: ['a', 'b'],
        code: 'SUCCESS',
        timestamp: new Date().toISOString(),
      };

      customerService.loadCurrent().subscribe(() => {
        expect(req.request.method).toBe('GET');
        expect(customerService.customers()).toEqual(response.data);
        expect(customerService.customerContext()).toBe('a');
      });

      const req = httpTesting.expectOne(`${apiUrl}/customers/current`);
      req.flush(response);
    });

    it('success with an existing customer in storage but does not match with customers response', (done) => {
      storage.getItem.mockReturnValue('c');

      const response: ApiResponseModel<string[]> = {
        data: ['a', 'b'],
        code: 'SUCCESS',
        timestamp: new Date().toISOString(),
      };

      customerService.loadCurrent().subscribe(() => {
        expect(customerService.customers()).toEqual(response.data);
        expect(customerService.customerContext()).toBe('a');
        done();
      });

      const req = httpTesting.expectOne(`${apiUrl}/customers/current`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });

    it('success with an existing customer in storage which matches customers repsonse', (done) => {
      storage.getItem.mockReturnValue('b');

      const response: ApiResponseModel<string[]> = {
        data: ['a', 'b'],
        code: 'SUCCESS',
        timestamp: new Date().toISOString(),
      };

      customerService.loadCurrent().subscribe(() => {
        expect(customerService.customers()).toEqual(response.data);
        expect(customerService.customerContext()).toBe('b');
        done();
      });

      const req = httpTesting.expectOne(`${apiUrl}/customers/current`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });

    it('success with an existing customer in storage which matches customers repsonse', (done) => {
      customerService.loadCurrent().subscribe({
        complete: () => {
          done();
        },
      });
      const req = httpTesting.expectOne(`${apiUrl}/customers/current`);
      expect(req.request.method).toBe('GET');
      req.error(new ProgressEvent('test'));
    });
  });

  describe('changeCustomerContext', () => {
    it('should do nothing', () => {
      customerService.changeCustomerContext('');
      expect(storage.setItem).not.toHaveBeenCalled();
    });

    it('should throw exception', () => {
      initState({
        customers: ['a', 'b'],
      });
      expect(() => customerService.changeCustomerContext('c')).toThrow(
        'c is invalid'
      );
    });

    it('should set customer context', () => {
      initState({
        customers: ['a', 'b'],
      });
      customerService.changeCustomerContext('b');
      expect(customerService.customerContext()).toBe('b');
    });
  });
});
