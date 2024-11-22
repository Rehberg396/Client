import { Provider } from '@angular/core';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { AuthService } from './auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export type AuthOptions = {
  url: string;
  realm: string;
  clientId: string;
  resource: string;
};

export function provideAuth(options: AuthOptions): Provider[] {
  return [
    KeycloakService,
    {
      provide: AuthService,
      useFactory: (keycloakService: KeycloakService) =>
        new AuthService(options, keycloakService),
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
  ];
}
