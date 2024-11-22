import { TestBed } from '@angular/core/testing';
import { provideBoschIcon } from './bosch-ic.provider';
import { APP_INITIALIZER } from '@angular/core';

describe(provideBoschIcon.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideBoschIcon()],
    });
  });

  it('APP_INITIALIZER should have length of 1', () => {
    const appInits = TestBed.inject(APP_INITIALIZER);
    expect(appInits.length).toBe(1);
  });
});
