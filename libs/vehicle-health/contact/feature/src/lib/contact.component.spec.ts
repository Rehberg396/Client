import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastService } from '@cps/ui';
import { AuthService, AuthState } from '@cps/vehicle-health/auth';
import { ContactService } from '@cps/vehicle-health/data-access';
import { of, throwError } from 'rxjs';
import { ContactComponent } from './contact.component';

describe('ContactComponent  ', () => {
  const setup = async (config?: { authState?: AuthState }) => {
    const authService = {
      authState: signal(config?.authState ?? { isAuthenticated: false }),
      logout: jest.fn(),
    };
    const contactService = {
      postFeedback: jest.fn(),
    };

    const toastService = {
      success: jest.fn(),
      error: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ContactComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: ContactService,
          useValue: contactService,
        },
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return {
      fixture,
      component,
      authService,
      toastService,
      contactService,
    };
  };
  it('should create', async () => {
    const { component } = await setup({
      authState: {
        isAuthenticated: true,
        userInfo: {
          email: 'example@domain.local',
          hasAnyPermission: () => true,
          hasCustomerAttribute: () => true,
          name: 'name1',
          roles: [],
          username: 'user1',
          customer: 'customer1',
        },
      },
    });
    expect(component).toBeTruthy();
  });

  it('should create when userInfo.isAuthenticated false return empty', async () => {
    const { component } = await setup({
      authState: {
        isAuthenticated: false,
      },
    });
    expect(component).toBeTruthy();
    expect(component.userInfo().name).toEqual('');
    expect(component.userInfo().email).toEqual('');
  });

  describe('#handleSubmit', () => {
    it('should call postFeedback and display success toast on success', async () => {
      const { component, contactService, toastService } = await setup({
        authState: {
          isAuthenticated: true,
          userInfo: {
            email: 'example@domain.local',
            hasAnyPermission: () => true,
            hasCustomerAttribute: () => true,
            name: 'name1',
            roles: [],
            username: 'user1',
            customer: 'customer1',
          },
        },
      });
      const contactInfo = {
        name: 'Test User',
        email: 'test@example.com',
        feedback: 'body',
      };
      const resetFn = jest.fn();
      contactService.postFeedback.mockReturnValue(of(null));

      component.handleSubmit({ value: contactInfo, reset: resetFn });

      expect(contactService.postFeedback).toHaveBeenCalledWith(contactInfo);
      expect(toastService.success).toHaveBeenCalledWith(
        $localize`Send feedback successfully`
      );
      expect(component.isLoading()).toBe(false);
      expect(resetFn).toHaveBeenCalled();
    });

    it('should display error toast on failure', async () => {
      const { component, contactService, toastService } = await setup({
        authState: {
          isAuthenticated: true,
          userInfo: {
            email: 'example@domain.local',
            hasAnyPermission: () => true,
            hasCustomerAttribute: () => true,
            name: 'name1',
            roles: [],
            username: 'user1',
            customer: 'customer1',
          },
        },
      });
      const contactInfo = {
        name: 'Test User',
        email: 'test@example.com',
        feedback: 'body',
      };
      const resetFn = jest.fn();
      contactService.postFeedback.mockReturnValue(
        throwError(() => new Error('Error'))
      );

      component.handleSubmit({ value: contactInfo, reset: resetFn });

      expect(contactService.postFeedback).toHaveBeenCalledWith(contactInfo);
      expect(toastService.error).toHaveBeenCalledWith(
        $localize`Send feedback fail`
      );
      expect(component.isLoading()).toBe(false);
      expect(resetFn).not.toHaveBeenCalled();
    });
  });
});
