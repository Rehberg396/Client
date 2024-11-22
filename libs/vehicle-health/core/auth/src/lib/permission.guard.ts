import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from './auth.service';

export const permissionGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const authState = authService.authState();

  if (authState.isAuthenticated && !authState.userInfo.hasAnyPermission()) {
    return false;
  }
  return true;
};
