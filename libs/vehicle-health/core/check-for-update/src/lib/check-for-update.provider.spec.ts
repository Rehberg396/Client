import { TestBed } from '@angular/core/testing';
import { provideCheckForUpdate } from './check-for-update.provider';
import { CheckForUpdateService } from './check-for-update.service';
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

describe(provideCheckForUpdate.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideServiceWorker('ngsw-worker.js', {
          enabled: !isDevMode(),
          registrationStrategy: 'registerImmediately',
        }),
        provideCheckForUpdate(),
      ],
    });
  });

  it('should contain CheckForUpdateService in application context', () => {
    const service = TestBed.inject(CheckForUpdateService);
    expect(service).toBeTruthy();
  });
});
