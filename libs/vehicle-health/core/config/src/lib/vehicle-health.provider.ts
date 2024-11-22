import { Provider } from '@angular/core';
import { VehicleHealthEnvironment } from './vehicle-health.environment';
import { VH_ENVIRONMENT } from './token';

export function provideEnvironment(env: VehicleHealthEnvironment): Provider {
  return {
    provide: VH_ENVIRONMENT,
    useValue: env,
  };
}
