import { CookieService } from 'ngx-cookie-service';
import { add } from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerDialogComponent } from './disclaimer-dialog';

const DISCLAIMER_ACCEPTED = 'disclaimerAccepted';

export class DisclaimerService {
  constructor(
    private cookieService: CookieService,
    private dialog: MatDialog
  ) {}

  openDialog() {
    if (this.cookieService.check(DISCLAIMER_ACCEPTED)) {
      return;
    } else {
      this.dialog
        .open(DisclaimerDialogComponent, {
          disableClose: true,
          maxWidth: '44rem',
        })
        .afterClosed()
        .subscribe((isChecked) => {
          if (isChecked) {
            this.cookieService.set(DISCLAIMER_ACCEPTED, 'true', {
              path: '/',
              expires: add(new Date(), { years: 1 }),
              sameSite: 'Strict',
              secure: true,
            });
          }
        });
    }
  }
}
