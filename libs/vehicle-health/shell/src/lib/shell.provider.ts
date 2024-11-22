import { EnvironmentProviders, Provider } from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';
import { vehicleHealthRoutes } from './shell.routes';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { APP_INITIALIZER, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideBoschIcon, providePaginatorIntl } from '@cps/ui';
import { AuthService, provideAuth } from '@cps/vehicle-health/auth';
import { provideCheckForUpdate } from '@cps/vehicle-health/check-for-update';
import {
  provideEnvironment,
  TemplatePageTitleStrategy,
  VehicleHealthEnvironment,
} from '@cps/vehicle-health/config';
import { CustomerService, provideCustomer } from '@cps/vehicle-health/customer';
import { provideApiServices } from '@cps/vehicle-health/data-access';
import { provideDisclaimer } from '@cps/vehicle-health/disclaimers/ui';
import { exhaustMap } from 'rxjs';

export function provideVehicleHealth(
  env: VehicleHealthEnvironment
): (Provider | EnvironmentProviders)[] {
  return [
    provideRouter(
      vehicleHealthRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideCheckForUpdate(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideEnvironment(env),
    providePaginatorIntl(),
    provideBoschIcon(),
    provideAuth({
      clientId: env.keycloak.clientId,
      realm: env.keycloak.realm,
      url: env.keycloak.url,
      resource: env.keycloak.resource,
    }),
    provideCustomer({
      apiUrl: env.vh,
      interceptor: {
        addHeaderTo: [env.vh, env.sm],
      },
    }),
    provideDisclaimer(),
    provideApiServices({
      vh: env.vh,
      sm: env.sm,
    }),
    {
      provide: APP_INITIALIZER,
      useFactory:
        (authService: AuthService, customerService: CustomerService) => () =>
          authService
            .checkLogin()
            .pipe(exhaustMap(() => customerService.loadCurrent())),
      deps: [AuthService, CustomerService],
      multi: true,
    },
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
  ];
}
