import { InjectionToken } from '@angular/core';

export const BROWSER_LOCATION = new InjectionToken('Browser Location', {
  providedIn: 'root',
  factory: () => location,
});
