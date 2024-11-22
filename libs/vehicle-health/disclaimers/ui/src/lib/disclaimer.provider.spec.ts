import { TestBed } from '@angular/core/testing';
import { provideDisclaimer } from './disclaimer.provider';
import { DisclaimerService } from './disclaimer.service';

describe(provideDisclaimer.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideDisclaimer()],
    });
  });

  it('should contain DisclaimerService in application context', () => {
    const disclaimerService = TestBed.inject(DisclaimerService);
    expect(disclaimerService).toBeTruthy();
  });
});
