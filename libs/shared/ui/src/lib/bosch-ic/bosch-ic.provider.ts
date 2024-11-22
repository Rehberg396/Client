import { APP_INITIALIZER, Provider } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

export function provideBoschIcon(): Provider[] {
  return [
    {
      provide: APP_INITIALIZER,
      useFactory: (registry: MatIconRegistry) => {
        return () => {
          registry.setDefaultFontSetClass('bosch-ic');
        };
      },
      deps: [MatIconRegistry],
      multi: true,
    },
  ];
}
