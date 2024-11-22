import { Provider } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { CheckForUpdateService } from './check-for-update.service';

export function provideCheckForUpdate(): Provider[] {
  return [
    {
      provide: CheckForUpdateService,
      useFactory: (swUpdate: SwUpdate) => {
        return new CheckForUpdateService(swUpdate);
      },
      deps: [SwUpdate],
    },
  ];
}
