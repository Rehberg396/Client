import { InjectionToken } from '@angular/core';
import { VehicleHealthEnvironment } from './vehicle-health.environment';

export const VH_ENVIRONMENT = new InjectionToken<VehicleHealthEnvironment>(
  'Vehicle health environment'
);
