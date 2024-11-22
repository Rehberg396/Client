import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterModule, UrlSegment } from '@angular/router';
import { AuthService, AuthState } from './auth.service';
import { permissionGuard } from './permission.guard';

describe(permissionGuard.name, () => {
  const setup = (value: AuthState) => {
    const authService = {
      authState: signal(value),
    };

    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    });

    return { authService };
  };
  it('shoud return true', async () => {
    setup({ isAuthenticated: false });
    const result = await TestBed.runInInjectionContext(() =>
      permissionGuard({}, [new UrlSegment('/test', {})])
    );
    expect(result).toBe(true);
  });

  it('shoud return false', async () => {
    setup({
      isAuthenticated: true,
      userInfo: {
        roles: [],
        customer: 'test',
        email: 'test',
        name: 'test',
        username: 'test',
        hasAnyPermission: () => false,
        hasCustomerAttribute: () => false,
      },
    });
    const result = await TestBed.runInInjectionContext(() =>
      permissionGuard({}, [new UrlSegment('/test', {})])
    );
    expect(result).toBe(false);
  });
});
