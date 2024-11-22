import { TestBed } from '@angular/core/testing';
import { BROSWER_STORAGE } from './browser-storage.util';

describe('Browser Storage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should inject BROSWER_STORAGE', () => {
    const storage = TestBed.inject(BROSWER_STORAGE);
    expect(storage).toBeTruthy();
  });
});
