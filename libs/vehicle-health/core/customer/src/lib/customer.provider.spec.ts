import { TestBed } from '@angular/core/testing';
import { provideCustomer } from './customer.provider';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { BROSWER_STORAGE } from '@cps/util';
import { CustomerService } from './customer.service';

describe(provideCustomer.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BROSWER_STORAGE,
          useValue: {},
        },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideCustomer({
          apiUrl: 'https://api-server.com',
          interceptor: {
            addHeaderTo: ['https://api-server.com'],
          },
        }),
      ],
    });
  });

  it('should contain customer service', () => {
    const customerService = TestBed.inject(CustomerService);
    expect(customerService).toBeTruthy();
  });

  it('should contain customer interceptor', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptors.length).toBe(1);
  });
});
