import { CookieService } from 'ngx-cookie-service';
import { DisclaimerService } from './disclaimer.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

describe(DisclaimerService.name, () => {
  const setup = () => {
    const cookieService = {
      check: jest.fn(),
      set: jest.fn(),
    };
    const dialog = { open: jest.fn() };
    const disclaimerService = new DisclaimerService(
      cookieService as unknown as CookieService,
      dialog as unknown as MatDialog
    );

    return {
      cookieService,
      disclaimerService,
      dialog,
    };
  };

  it('shoud open dialog when there disclaimerAccepted cookie does not exist', () => {
    const { cookieService, dialog, disclaimerService } = setup();

    cookieService.check.mockReturnValue(false);
    dialog.open.mockImplementation(() => {
      return {
        afterClosed: () =>
          new Observable((subscriber) => {
            subscriber.next(true);
            subscriber.complete();
          }),
      };
    });

    disclaimerService.openDialog();

    expect(cookieService.set).toHaveBeenCalled();
  });

  it('should do nothing when disclaimerAccepted cookie exists', () => {
    const { cookieService, dialog, disclaimerService } = setup();

    cookieService.check.mockReturnValue(true);

    disclaimerService.openDialog();

    expect(dialog.open).not.toHaveBeenCalled();
    expect(cookieService.set).not.toHaveBeenCalled();
  });
});
