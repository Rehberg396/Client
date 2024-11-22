import { TestBed } from '@angular/core/testing';
import { BROWSER_LOCATION } from './browser-location.util';

describe('Browser Location', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should inject BROWSER_LOCATION', () => {
    const location = TestBed.inject(BROWSER_LOCATION);
    expect(location).toBeTruthy();
  });
});
