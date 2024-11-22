import { Provider } from '@angular/core';
import { CustomerService } from './customer.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { BROSWER_STORAGE } from '@cps/util';
import { CustomerInterceptor } from './customer.interceptor';

export type CustomerOptions = {
  apiUrl: string;
  interceptor: {
    addHeaderTo: string[];
  };
};

export function provideCustomer(options: CustomerOptions): Provider[] {
  return [
    {
      provide: CustomerService,
      useFactory: (http: HttpClient, storage: Storage) =>
        new CustomerService(options.apiUrl, http, storage),
      deps: [HttpClient, BROSWER_STORAGE],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (customerService: CustomerService) => {
        return new CustomerInterceptor(
          customerService,
          options.interceptor.addHeaderTo
        );
      },
      deps: [CustomerService],
      multi: true,
    },
  ];
}
