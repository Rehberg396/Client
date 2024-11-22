// import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
// import { provideRouter, Router } from '@angular/router';
// import { RouterTestingHarness } from '@angular/router/testing';
// import { VersionEvent } from '@angular/service-worker';
// import { ToastService } from '@cps/ui';
// import { BROWSER_LOCATION } from '@cps/util';
// import { AuthService, AuthState } from '@cps/vehicle-health/auth';
// import { CheckForUpdateService } from '@cps/vehicle-health/check-for-update';
// import { VH_ENVIRONMENT } from '@cps/vehicle-health/config';
// import { CustomerService } from '@cps/vehicle-health/customer';
// import {
//   NotificationService,
//   VehicleService,
// } from '@cps/vehicle-health/data-access';
// import { DisclaimerService } from '@cps/vehicle-health/disclaimers/ui';
// import { of, ReplaySubject } from 'rxjs';
// import { ShellComponent } from './shell.component';

// @Component({ standalone: true, selector: 'vh-stub', template: '' })
// class StubComponent {}

// describe(ShellComponent.name, () => {
//   const setup = async (config?: {
//     authState?: AuthState;
//     checkForUpdate?: { isEnabled: boolean };
//   }) => {
//     const authService = {
//       authState: signal(config?.authState ?? { isAuthenticated: false }),
//       logout: jest.fn(),
//     };
//     const disclaimerService = {
//       openDialog: jest.fn(),
//     };
//     const browserLocation = {
//       reload: jest.fn(),
//     };
//     const versionsSubject = new ReplaySubject<VersionEvent>();
//     const checkUpdateSubject = new ReplaySubject<boolean>();
//     const checkForUpdateService = {
//       isEnabled: config?.checkForUpdate?.isEnabled ?? false,
//       versionUpdates: jest.fn(),
//       intervalCheckUpdate: jest.fn(),
//       checkForUpdate: jest.fn(),
//     };
//     checkForUpdateService.versionUpdates.mockImplementation(() =>
//       versionsSubject.asObservable()
//     );

//     checkForUpdateService.intervalCheckUpdate.mockImplementation(() =>
//       checkUpdateSubject.asObservable()
//     );

//     const toastService = {
//       success: jest.fn(),
//       error: jest.fn(),
//     };

//     const notificationService = {
//       countUnreadNotifications: jest.fn().mockReturnValue(of({ data: 1 })),
//     };
//     const vehicleService = {
//       getEngineTypes: jest.fn().mockReturnValue(of({ data: [] })),
//     };
//     const customerService = {
//       changeCustomerContext: jest.fn(),
//       customers: signal({}),
//       customerContext: signal({}),
//     };

//     await TestBed.configureTestingModule({
//       imports: [ShellComponent],
//       providers: [
//         {
//           provide: AuthService,
//           useValue: authService,
//         },
//         {
//           provide: DisclaimerService,
//           useValue: disclaimerService,
//         },
//         { provide: BROWSER_LOCATION, useValue: browserLocation },
//         { provide: VH_ENVIRONMENT, useValue: { checkForUpdateRate: 100 } },
//         { provide: AuthService, useValue: authService },
//         { provide: CustomerService, useValue: customerService },
//         { provide: CheckForUpdateService, useValue: checkForUpdateService },
//         { provide: ToastService, useValue: toastService },
//         { provide: NotificationService, useValue: notificationService },
//         { provide: VehicleService, useValue: vehicleService },
//         provideRouter([
//           {
//             path: 'parent',
//             component: StubComponent,
//             data: {
//               breadcrumb: 'parent',
//             },
//             children: [
//               {
//                 path: 'child',
//                 component: StubComponent,
//                 data: {
//                   breadcrumb: 'child',
//                 },
//               },
//             ],
//           },
//         ]),
//       ],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents();

//     const harness = await RouterTestingHarness.create();
//     const fixture = TestBed.createComponent(ShellComponent);
//     const component = fixture.componentInstance;
//     fixture.detectChanges();

//     return {
//       fixture,
//       component,
//       authService,
//       disclaimerService,
//       harness,
//       browserLocation,
//       versionsSubject,
//       checkUpdateSubject,
//       toastService,
//       checkForUpdateService,
//     };
//   };

//   describe('disclaimer', () => {
//     it('should open dialog', async () => {
//       const { disclaimerService } = await setup({
//         authState: {
//           isAuthenticated: true,
//           userInfo: {
//             email: 'example@domain.local',
//             hasAnyPermission: () => true,
//             hasCustomerAttribute: () => true,
//             name: 'name1',
//             roles: [],
//             username: 'user1',
//             customer: 'customer1',
//           },
//         },
//       });
//       expect(disclaimerService.openDialog).toHaveBeenCalled();
//     });

//     it('should not open dialog', async () => {
//       const { disclaimerService } = await setup({
//         authState: {
//           isAuthenticated: false,
//         },
//       });
//       expect(disclaimerService.openDialog).not.toHaveBeenCalled();
//     });
//   });

//   describe('breadcrumbs', () => {
//     it('should return child', async () => {
//       const { component, fixture, harness } = await setup();
//       await harness.navigateByUrl('/parent/child');
//       await fixture.whenStable();
//       fixture.detectChanges();
//       component.breadcrumbs$.subscribe((data) => {
//         expect(data).toEqual(['parent', 'child']);
//       });
//     });

//     it('should return parent', async () => {
//       const { fixture, component, harness } = await setup();
//       await harness.navigateByUrl('/parent');
//       await fixture.whenStable();
//       fixture.detectChanges();
//       component.breadcrumbs$.subscribe((data) => {
//         expect(data).toEqual(['parent']);
//       });
//     });
//   });

//   describe('logout', () => {
//     it('should call logout', async () => {
//       const { component, authService } = await setup();
//       component.onLogout();
//       expect(authService.logout).toHaveBeenCalled();
//     });
//   });

//   describe('checkForUpdate', () => {
//     it('should show success message', async () => {
//       const { component, versionsSubject, toastService } = await setup({
//         checkForUpdate: { isEnabled: true },
//       });
//       versionsSubject.next({
//         type: 'VERSION_READY',
//         currentVersion: { hash: 'old' },
//         latestVersion: { hash: 'new' },
//       });
//       expect(toastService.success).toHaveBeenCalledWith(
//         'A new version is available.'
//       );
//       expect(component.numberOfNewVersions()).toBe(1);
//     });
//     it('should call with 100ms', async () => {
//       const { checkForUpdateService, checkUpdateSubject } = await setup({
//         checkForUpdate: { isEnabled: true },
//       });

//       checkUpdateSubject.next(true);
//       expect(checkForUpdateService.intervalCheckUpdate).toHaveBeenCalledWith(
//         100
//       );
//     });

//     it('should toast "A new version is available."', async () => {
//       const {
//         component,
//         checkForUpdateService,
//         versionsSubject,
//         toastService,
//       } = await setup({
//         checkForUpdate: { isEnabled: true },
//       });

//       versionsSubject.next({
//         type: 'VERSION_READY',
//         currentVersion: { hash: 'old' },
//         latestVersion: { hash: 'new' },
//       });

//       const subject = new ReplaySubject<void>();
//       checkForUpdateService.checkForUpdate.mockImplementation(() =>
//         subject.asObservable()
//       );

//       component.checkForUpdate();
//       subject.next();

//       expect(checkForUpdateService.checkForUpdate).toHaveBeenCalled();
//       expect(toastService.success).toHaveBeenCalledWith(
//         'A new version is available.'
//       );
//     });

//     it('should toast "Already on the latest version."', async () => {
//       const { component, checkForUpdateService, toastService } = await setup({
//         checkForUpdate: { isEnabled: true },
//       });

//       const subject = new ReplaySubject<void>();
//       checkForUpdateService.checkForUpdate.mockImplementation(() =>
//         subject.asObservable()
//       );

//       component.checkForUpdate();
//       subject.next();

//       expect(checkForUpdateService.checkForUpdate).toHaveBeenCalled();
//       expect(toastService.success).toHaveBeenCalledWith(
//         'Already on the latest version.'
//       );
//     });

//     it('should toast "Error occur when check for update."', async () => {
//       const { component, checkForUpdateService, toastService } = await setup({
//         checkForUpdate: { isEnabled: true },
//       });

//       const subject = new ReplaySubject<void>();
//       checkForUpdateService.checkForUpdate.mockImplementation(() =>
//         subject.asObservable()
//       );

//       component.checkForUpdate();
//       subject.error({});

//       expect(checkForUpdateService.checkForUpdate).toHaveBeenCalled();
//       expect(toastService.error).toHaveBeenCalledWith(
//         'Error occur when check for update.'
//       );
//     });
//   });

//   describe('changeCustomer', () => {
//     it('should call reload and navigate to root', async () => {
//       const { component, browserLocation } = await setup();
//       const router = TestBed.inject(Router);
//       jest.spyOn(router, 'navigateByUrl');
//       await component.changeCustomer('test');
//       expect(browserLocation.reload).toHaveBeenCalled();
//       expect(router.navigateByUrl).toHaveBeenCalledWith('/');
//     });
//   });
// });
