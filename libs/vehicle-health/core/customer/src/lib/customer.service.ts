import { HttpClient } from '@angular/common/http';
import { computed, signal, WritableSignal } from '@angular/core';
import { ApiResponseModel } from '@cps/types';
import { catchError, EMPTY, filter, tap } from 'rxjs';
import { X_CUSTOMER } from './customer.const';

export interface CustomerState {
  customers: string[];
  customerContext?: string;
}

export class CustomerService {
  private readonly store: WritableSignal<CustomerState>;

  readonly customers = computed(() => this.store().customers);
  readonly customerContext = computed(() => this.store().customerContext);

  constructor(
    private apiUrl: string,
    private http: HttpClient,
    private storage: Storage,
    initState: CustomerState = {
      customers: [],
      customerContext: undefined,
    }
  ) {
    this.store = signal<CustomerState>(initState);
  }

  loadCurrent() {
    return this.http
      .get<ApiResponseModel<string[]>>(`${this.apiUrl}/customers/current`)
      .pipe(
        catchError(() => EMPTY),
        filter((response) => Boolean(response.data)),
        tap((response) => {
          this.store.update((state) => ({
            ...state,
            customers: response.data,
          }));
          this.initCustomerContext();
        })
      );
  }

  private initCustomerContext() {
    const customers = this.customers();
    const xCustomer = this.getCustomerContextInStorage();
    if (!xCustomer) {
      this.store.update((state) => ({
        ...state,
        customerContext: customers[0],
      }));
      return;
    }
    const foundCustomer = this.findCustomer(xCustomer);
    if (!foundCustomer) {
      this.store.update((state) => ({
        ...state,
        customerContext: customers[0],
      }));
      return;
    }
    this.store.update((state) => ({
      ...state,
      customerContext: foundCustomer,
    }));
  }

  changeCustomerContext(value: string) {
    const customers = this.customers();
    if (!customers || customers.length === 0) {
      return;
    }
    const foundCustomer = customers.find((customer) => customer === value);
    if (!foundCustomer) {
      throw Error(`${value} is invalid`);
    }
    this.store.update((state) => ({
      ...state,
      customerContext: foundCustomer,
    }));
    this.saveCustomerContext(value);
  }

  private findCustomer(value: string) {
    return this.customers().find((customer) => customer === value);
  }

  private getCustomerContextInStorage() {
    return this.storage.getItem(X_CUSTOMER);
  }

  private saveCustomerContext(value: string) {
    this.storage.setItem(X_CUSTOMER, value);
  }
}
