import { InjectionToken } from '@angular/core';

export const BROSWER_STORAGE = new InjectionToken('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage,
});
