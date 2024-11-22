import { SwUpdate } from '@angular/service-worker';
import {
  asyncScheduler,
  catchError,
  concatMap,
  interval,
  of,
  scheduled,
} from 'rxjs';

export class CheckForUpdateService {
  isEnabled: boolean;

  constructor(private swUpdate: SwUpdate) {
    this.isEnabled = swUpdate.isEnabled;
  }

  intervalCheckUpdate(ms: number) {
    return interval(ms).pipe(
      concatMap(() => this.checkForUpdate().pipe(catchError(() => of(false))))
    );
  }

  versionUpdates() {
    return this.swUpdate.versionUpdates;
  }

  checkForUpdate() {
    return scheduled(this.swUpdate.checkForUpdate(), asyncScheduler);
  }
}
