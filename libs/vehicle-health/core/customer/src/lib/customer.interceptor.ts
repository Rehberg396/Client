import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerService } from './customer.service';
import { X_CUSTOMER } from './customer.const';

export class CustomerInterceptor implements HttpInterceptor {
  constructor(
    private customerService: CustomerService,
    private baseUrls: string[]
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.baseUrls.some((url) => request.url.startsWith(url))) {
      const customer = this.customerService.customerContext();
      const cloneReq = request.clone({
        headers: customer
          ? request.headers.append(X_CUSTOMER, customer)
          : request.headers,
      });
      return next.handle(cloneReq);
    }
    return next.handle(request);
  }
}
