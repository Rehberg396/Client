import { KeycloakService } from 'keycloak-angular';
import { AuthService, User, UserInfo } from './auth.service';

describe(AuthService.name, () => {
  const setup = () => {
    const loadUserInfo = jest.fn();
    const keycloakService = {
      init: jest.fn(),
      getKeycloakInstance: () => ({
        loadUserInfo,
      }),
      logout: jest.fn(),
    };
    const options = {
      clientId: 'test',
      realm: 'test',
      resource: 'resource',
      url: 'https://auth-server.test',
    };
    const authService = new AuthService(
      options,
      keycloakService as unknown as KeycloakService
    );

    return { authService, options, keycloakService, loadUserInfo };
  };

  describe('checkLogin', () => {
    it('should set authState with correct value', (done) => {
      const { authService, options, keycloakService, loadUserInfo } = setup();

      loadUserInfo.mockResolvedValue({
        sub: 'test',
        resource_access: {
          [options.resource]: {
            roles: ['ROLE_TEST'],
          },
        },
        email_verified: false,
        name: 'full name',
        preferred_username: 'username',
        given_name: 'given name',
        family_name: 'family name',
        email: 'email@example.com',
        customer: 'customer',
      });

      keycloakService.init.mockResolvedValue(true);

      const subscription = authService.checkLogin();

      subscription.subscribe((userInfo) => {
        expect(keycloakService.init).toHaveBeenCalledWith({
          config: {
            url: options.url,
            realm: options.realm,
            clientId: options.clientId,
          },
          initOptions: {
            onLoad: 'login-required',
            checkLoginIframe: false,
          },
        });
        const authState = authService.authState();
        expect(authState.isAuthenticated).toBe(true);
        authState.isAuthenticated &&
          expect(authState.userInfo).toEqual(userInfo);
        expect(userInfo.hasAnyPermission()).toBe(true);
        done();
      });
    });

    it('should has empty role when resource_access = undefined', (done) => {
      const { authService, keycloakService, loadUserInfo } = setup();

      keycloakService.init.mockResolvedValue(true);
      loadUserInfo.mockResolvedValue({
        sub: 'test',
        resource_access: {},
        email_verified: false,
        name: 'full name',
        preferred_username: 'username',
        given_name: 'given name',
        family_name: 'family name',
        email: 'email@example.com',
        customer: 'customer',
      });

      const subscription = authService.checkLogin();

      subscription.subscribe((userInfo) => {
        expect(userInfo.hasAnyPermission()).toBe(false);
        expect(userInfo.roles).toEqual([]);
        done();
      });
    });
  });

  describe('logout', () => {
    it('should call keycloakService.logout()', () => {
      const { authService, keycloakService } = setup();

      authService.logout();

      expect(keycloakService.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('User', () => {
    it('should map properties correctly', () => {
      const user = new User(
        {
          resource_access: { backend: { roles: ['a', 'b'] } },
          customer: 'test',
          email: 'test@domain.example',
          email_verified: false,
          family_name: 'Last',
          given_name: 'First',
          name: 'First Last',
          preferred_username: 'username',
          sub: 'xxx',
        },
        'backend'
      );
      expect(user).toEqual({
        email: 'test@domain.example',
        name: 'First Last',
        roles: ['a', 'b'],
        username: 'username',
        customer: 'test',
      } as UserInfo);
    });

    describe('hasCustomerAttribute', () => {
      it('should return true', () => {
        const user = new User(
          {
            resource_access: { backend: { roles: [] } },
            customer: 'test',
            email: 'test@domain.example',
            email_verified: false,
            family_name: 'Last',
            given_name: 'First',
            name: 'First Last',
            preferred_username: 'username',
            sub: 'xxx',
          },
          'backend'
        );
        expect(user.hasCustomerAttribute()).toBe(true);
      });

      it('should return false', () => {
        const user = new User(
          {
            resource_access: { backend: { roles: [] } },
            email: 'test@domain.example',
            email_verified: false,
            family_name: 'Last',
            given_name: 'First',
            name: 'First Last',
            preferred_username: 'username',
            sub: 'xxx',
          },
          'backend'
        );
        expect(user.hasCustomerAttribute()).toBe(false);
      });
    });

    describe('hasAnyPermission', () => {
      it('should return true when provide correct resource and the resource contains a role and has customer attribute', () => {
        const user = new User(
          {
            resource_access: { backend: { roles: ['test'] } },
            email: 'test@domain.example',
            email_verified: false,
            family_name: 'Last',
            given_name: 'First',
            name: 'First Last',
            preferred_username: 'username',
            sub: 'xxx',
            customer: 'test',
          },
          'backend'
        );
        expect(user.hasAnyPermission()).toBe(true);
      });

      it('should return false when resource does not match', () => {
        const user = new User(
          {
            resource_access: { backend: { roles: ['test'] } },
            email: 'test@domain.example',
            email_verified: false,
            family_name: 'Last',
            given_name: 'First',
            name: 'First Last',
            preferred_username: 'username',
            sub: 'xxx',
            customer: 'test',
          },
          'other'
        );
        expect(user.hasAnyPermission()).toBe(false);
      });

      it('should return true when roles is empty', () => {
        const user = new User(
          {
            resource_access: { backend: { roles: [] } },
            email: 'test@domain.example',
            email_verified: false,
            family_name: 'Last',
            given_name: 'First',
            name: 'First Last',
            preferred_username: 'username',
            sub: 'xxx',
            customer: 'test',
          },
          'backend'
        );
        expect(user.hasAnyPermission()).toBe(false);
      });

      it('should return false when there is no customer attribute', () => {
        const user = new User(
          {
            resource_access: { backend: { roles: ['test'] } },
            email: 'test@domain.example',
            email_verified: false,
            family_name: 'Last',
            given_name: 'First',
            name: 'First Last',
            preferred_username: 'username',
            sub: 'xxx',
          },
          'backend'
        );
        expect(user.hasAnyPermission()).toBe(false);
      });

      it('should return false when resource_access is undefined', () => {
        const user = new User(
          {
            email: 'test@domain.example',
            email_verified: false,
            family_name: 'Last',
            given_name: 'First',
            name: 'First Last',
            preferred_username: 'username',
            sub: 'xxx',
          },
          'backend'
        );
        expect(user.hasAnyPermission()).toBe(false);
      });
    });
  });
});
