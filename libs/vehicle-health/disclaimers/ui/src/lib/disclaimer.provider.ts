import { Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DisclaimerService } from './disclaimer.service';
import { MatDialog } from '@angular/material/dialog';

export function provideDisclaimer(): Provider[] {
  return [
    {
      provide: DisclaimerService,
      useFactory: (cookieService: CookieService, dialog: MatDialog) =>
        new DisclaimerService(cookieService, dialog),
      deps: [CookieService, MatDialog],
    },
  ];
}
