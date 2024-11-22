import { KeycloakService } from 'keycloak-angular';
import { AuthOptions } from './auth.provider';
import { computed, signal, WritableSignal } from '@angular/core';
import { filter, from, map, mergeMap, tap } from 'rxjs';
import Keycloak from 'keycloak-js';

interface KeycloakUserInfo {
  sub: string;
  resource_access?: ResourceAccess;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  customer?: string;
}

interface ResourceAccess {
  [key: string]: Account;
}

interface Account {
  roles: string[];
}

export type AuthState =
  | {
      isAuthenticated: false;
    }
  | {
      isAuthenticated: true;
      userInfo: UserInfo;
    };

export interface UserInfo {
  customer?: string;
  email: string;
  name: string;
  username: string;
  roles: string[];
  hasAnyPermission: () => boolean;
  hasCustomerAttribute: () => boolean;
}

export class User implements UserInfo {
  customer?: string;
  email: string;
  name: string;
  username: string;
  roles: string[];

  constructor(userInfo: KeycloakUserInfo, resourceAccess: string) {
    this.customer = userInfo.customer;
    this.email = userInfo.email;
    this.name = userInfo.name;
    this.roles = userInfo.resource_access?.[resourceAccess]?.roles ?? [];
    this.username = userInfo.preferred_username;
  }

  hasAnyPermission() {
    return this.roles.length > 0 && this.hasCustomerAttribute();
  }

  hasCustomerAttribute() {
    return Boolean(this.customer);
  }
}

export class AuthService {
  #options: AuthOptions;
  #keycloakService: KeycloakService;

  private readonly store: WritableSignal<AuthState>;

  readonly authState = computed(() => this.store());

  constructor(
    options: AuthOptions,
    keycloakService: KeycloakService,
    initialState: AuthState = { isAuthenticated: false }
  ) {
    this.#options = options;
    this.#keycloakService = keycloakService;
    this.store = signal<AuthState>(initialState);
  }

  private init() {
    return from(
      this.#keycloakService.init({
        config: {
          url: this.#options.url,
          realm: this.#options.realm,
          clientId: this.#options.clientId,
        },
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false,
        },
      })
    ).pipe(
      filter((isAuthenticated) => Boolean(isAuthenticated)),
      map(() => this.#keycloakService.getKeycloakInstance())
    );
  }

  private loadUserInfo(keycloak: Keycloak) {
    return from(
      keycloak.loadUserInfo() as unknown as Promise<KeycloakUserInfo>
    ).pipe(map((userInfo) => new User(userInfo, this.#options.resource)));
  }

  checkLogin() {
    return this.init().pipe(
      mergeMap((keycloak) => this.loadUserInfo(keycloak)),
      tap((next) => {
        this.store.set({
          isAuthenticated: true,
          userInfo: next,
        });
      })
    );
  }

  logout() {
    this.#keycloakService.logout();
  }
}
