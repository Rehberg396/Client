import { TestBed } from '@angular/core/testing';
import { provideAuth } from './auth.provider';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth.service';

describe(provideAuth.name, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideAuth({
          clientId: 'test',
          realm: 'test',
          resource: 'test',
          url: 'test',
        }),
      ],
    });
  });

  it('HTTP_INTERCEPTORS should have length of 1', () => {
    const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
    expect(interceptors.length).toBe(1);
  });

  it('should contain AuthService in Application Context', () => {
    const authService = TestBed.inject(AuthService);
    expect(authService).toBeTruthy();
  });
});
