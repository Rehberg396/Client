import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Router } from '@angular/router';
import { UserNotification } from '@cps/types';
import {
  NotificationService,
  VehicleService,
} from '@cps/vehicle-health/data-access';
import { Observable, of } from 'rxjs';
import { NotificationComponent } from './notification.component';

describe(NotificationComponent.name, () => {
  const unreadUserNotification: UserNotification = {
    category: 'manual_update_enginetype',
    content: 'test',
    createdDate: '2024-01-01T00:00:00Z',
    id: 'test-id-1',
    messageStatus: 'unread',
    metadata: { vin: 'test' },
  };

  const readNotification = {
    category: 'test',
    content: 'test',
    createdDate: '2024-01-01T01:00:00Z',
    id: 'test-id-2',
    messageStatus: 'read',
    metadata: { vin: 'test' },
  };

  const userNotifications = [unreadUserNotification, readNotification];

  const vehicleService = {
    getEngineTypes: jest.fn().mockReturnValue(of({ data: ['Generic', 'BEV'] })),
    getByVin: jest.fn().mockReturnValue(of({ data: { vin: 'test' } })),
    edit: jest.fn().mockReturnValue(of({})),
  };

  const notificationService = {
    countUnreadNotifications: jest.fn().mockReturnValue(of({ data: 0 })),
    getNotifications: jest
      .fn()
      .mockReturnValue(of({ data: [unreadUserNotification] })),
    update: jest.fn().mockReturnValue(of({})),
  };

  const defaultMock = {
    notificationService,
    vehicleService,
  };

  const setup = async (config = defaultMock) => {
    const localeId = 'en-US';
    const router = {
      navigate: jest.fn(),
    };

    const dialogRef = {
      componentInstance: {
        isLoading: {
          set: jest.fn(),
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
        handleSubmit: (data: { engineType: string }) => {},
      },
      close: jest.fn(),
    };
    const dialog = {
      open: jest.fn().mockReturnValue(dialogRef),
    };

    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [
        provideAnimationsAsync('noop'),
        {
          provide: LOCALE_ID,
          useValue: localeId,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: NotificationService,
          useValue: config.notificationService,
        },
        {
          provide: VehicleService,
          useValue: config.vehicleService,
        },
        {
          provide: MatDialog,
          useValue: dialog,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotificationComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    return {
      fixture,
      component,
      notificationService: config.notificationService,
      vehicleService: config.vehicleService,
      router,
      dialog,
      dialogRef,
    };
  };

  describe('initial', () => {
    it('isLoading() is false', async () => {
      const { component } = await setup();
      expect(component.isLoading()).toBe(false);
    });
    it('isActive() is false', async () => {
      const { component } = await setup();
      expect(component.isActive()).toBe(false);
    });
    it('filter is undefined', async () => {
      const { component } = await setup();
      expect(component.filter()).toBe(undefined);
    });
    it('nextToken is null', async () => {
      const { component } = await setup();
      expect(component.nextToken).toBeNull();
    });
    it('hasMore is true', async () => {
      const { component } = await setup();
      expect(component.hasMore).toBe(true);
    });
    it('notifications should be empty', async () => {
      const { component } = await setup();
      component.notifications$.subscribe((notifications) => {
        expect(notifications.length).toBe(0);
      });
    });
  });

  describe('engineTypes', () => {
    it('load success', async () => {
      const { component } = await setup({
        ...defaultMock,
        vehicleService: {
          ...vehicleService,
          getEngineTypes: jest.fn().mockReturnValue(of({ data: ['a', 'b'] })),
        },
      });
      component.engineTypes$.subscribe((next) =>
        expect(next).toEqual(['a', 'b'])
      );
    });

    it('load error', async () => {
      const { component } = await setup({
        ...defaultMock,
        vehicleService: {
          ...vehicleService,
          getEngineTypes: jest
            .fn()
            .mockReturnValue(
              new Observable((sub) => sub.error({ message: 'error' }))
            ),
        },
      });
      component.engineTypes$.subscribe((next) => expect(next).toEqual([]));
    });
  });

  describe('unreadCount', () => {
    it('load success', async () => {
      const { component } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          countUnreadNotifications: jest.fn().mockReturnValue(of({ data: 10 })),
        },
      });
      component.unreadCount$.subscribe((value) => expect(value).toBe(10));
    });
    it('load error fallback to 0', async () => {
      const { component } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          countUnreadNotifications: jest
            .fn()
            .mockReturnValue(
              new Observable((sub) =>
                sub.error({ message: 'Internal server error' })
              )
            ),
        },
      });
      component.unreadCount$.subscribe((value) => expect(value).toBe(0));
    });
  });

  describe('menu', () => {
    it('opened() should be true and isActive() should be true', async () => {
      const { component } = await setup();
      component.menuOpened();
      expect(component.opened()).toBe(true);
      expect(component.isActive()).toBe(true);
    });

    it('opened() should be false', async () => {
      const { component } = await setup();
      component.menuClosed();
      expect(component.opened()).toBe(false);
    });
  });

  describe('getNotifications', () => {
    it('should call notificationService.getNotifications() with filter has only limit and timestamp', async () => {
      const { component, notificationService: service } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest.fn().mockReturnValue(of({ data: [] })),
        },
      });
      const now = new Date();
      component.getNotifications(now);
      expect(service.getNotifications).toHaveBeenCalledWith({
        limit: 5,
        timestamp: now.toJSON(),
      });
      expect(component.hasMore).toBe(false);
    });

    it('should call notificationService.getNotifications() with filter including unread status', async () => {
      const now = new Date();
      const { component, notificationService: service } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest.fn().mockReturnValue(
            of({
              data: [unreadUserNotification],
            })
          ),
        },
      });
      component.filter.set('unread');
      component.getNotifications(now);
      expect(service.getNotifications).toHaveBeenCalledWith({
        limit: 5,
        timestamp: now.toJSON(),
        status: 'unread',
      });
      expect(component.nextToken).toEqual(
        new Date(unreadUserNotification.createdDate)
      );
      component.notifications$.subscribe((notifications) => {
        expect(notifications).toEqual([unreadUserNotification]);
      });
    });

    it('should do nothing when error occur', async () => {
      const now = new Date();
      const { component, notificationService: service } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(
              new Observable((sub) => sub.error({ message: 'error' }))
            ),
        },
      });
      component.getNotifications(now);
      expect(service.getNotifications).toHaveBeenCalledWith({
        limit: 5,
        timestamp: now.toJSON(),
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark as read success', async () => {
      const {
        component,
        fixture,
        notificationService: notiService,
      } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: userNotifications })),
          countUnreadNotifications: jest.fn().mockReturnValue(of({ data: 1 })),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.markAsRead(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      component.notifications$.subscribe((notifications) => {
        expect(notifications[0]).toEqual({
          ...unreadUserNotification,
          messageStatus: 'read',
        });
      });
      component.unreadCount$.subscribe((count) => {
        expect(count).toBe(0);
      });
      expect(notiService.update).toHaveBeenCalledWith({
        messageId: unreadUserNotification.id,
        command: 'MARK_AS_READ',
      });
    });

    it('should mark as read error', async () => {
      const {
        component,
        fixture,
        notificationService: notiService,
      } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: userNotifications })),
          update: jest
            .fn()
            .mockReturnValue(new Observable((sub) => sub.error({}))),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.markAsRead(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      component.notifications$.subscribe((notifications) => {
        expect(notifications[0]).toEqual({
          ...unreadUserNotification,
          messageStatus: 'unread',
        });
      });
      expect(notiService.update).toHaveBeenCalledWith({
        messageId: unreadUserNotification.id,
        command: 'MARK_AS_READ',
      });
    });

    it('should do nothing when it is already read state', async () => {
      const {
        component,
        fixture,
        notificationService: notiService,
      } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: [readNotification] })),
          update: jest.fn(),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.markAsRead(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      expect(notiService.update).not.toHaveBeenCalled();
    });
  });

  describe('markAsUnread', () => {
    it('should mark as unread success', async () => {
      const {
        component,
        fixture,
        notificationService: notiService,
      } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: [readNotification] })),
          countUnreadNotifications: jest.fn().mockReturnValue(of({ data: 0 })),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.markAsUnread(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      component.notifications$.subscribe((notifications) => {
        expect(notifications[0]).toEqual({
          ...readNotification,
          messageStatus: 'unread',
        });
      });
      component.unreadCount$.subscribe((count) => {
        expect(count).toBe(1);
      });
      expect(notiService.update).toHaveBeenCalledWith({
        messageId: readNotification.id,
        command: 'MARK_AS_UNREAD',
      });
    });

    it('should do nothing when it is already unread state', async () => {
      const {
        component,
        fixture,
        notificationService: notiService,
      } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: [unreadUserNotification] })),
          update: jest.fn(),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.markAsUnread(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      expect(notiService.update).not.toHaveBeenCalled();
    });

    it('should mark as unread error', async () => {
      const {
        component,
        fixture,
        notificationService: notiService,
      } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: [readNotification] })),
          update: jest
            .fn()
            .mockReturnValue(new Observable((sub) => sub.error({}))),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.markAsUnread(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      component.notifications$.subscribe((notifications) => {
        expect(notifications[0]).toEqual(readNotification);
      });
      expect(notiService.update).toHaveBeenCalledWith({
        messageId: readNotification.id,
        command: 'MARK_AS_UNREAD',
      });
    });
  });

  describe('updateEngineType', () => {
    it('should call notificationService.getNotifications() with filter has only limit and timestamp', async () => {
      const {
        component,
        fixture,
        dialogRef,
        notificationService: service,
      } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: [unreadUserNotification] })),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.updateEngineType(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      dialogRef.componentInstance.handleSubmit({ engineType: 'test' });

      expect(vehicleService.getByVin).toHaveBeenCalled();
      expect(vehicleService.edit).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('checkItOut', () => {
    it('should navigate to vehicle page', async () => {
      const { component, router, fixture } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: [unreadUserNotification] })),
        },
      });

      component.getNotifications(new Date());
      await fixture.whenStable();

      component.checkItOut(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      expect(router.navigate).toHaveBeenCalledWith(['/vehicle'], {
        queryParams: {
          needManualUpdatedEngineType: true,
          search: unreadUserNotification.metadata['vin'],
        },
      });
    });
  });

  describe('handleScrolledIndexChange', () => {
    it('should do nothing when isLoading() is true', async () => {
      const { component } = await setup();
      component.isLoading.set(true);
      jest.spyOn(component, 'getNotifications');
      component.handleScrolledIndexChange({} as CdkVirtualScrollViewport);
      expect(component.getNotifications).not.toHaveBeenCalled();
    });

    it('should do nothing when hasMore is false', async () => {
      const { component } = await setup();
      component.hasMore = false;
      jest.spyOn(component, 'getNotifications');
      component.handleScrolledIndexChange({} as CdkVirtualScrollViewport);
      expect(component.getNotifications).not.toHaveBeenCalled();
    });

    it('should do nothing when measureScrollOffset() is greater than item height', async () => {
      const { component } = await setup();
      component.hasMore = true;
      jest.spyOn(component, 'getNotifications');
      component.handleScrolledIndexChange({
        measureScrollOffset: () => 121,
      } as CdkVirtualScrollViewport);
      expect(component.getNotifications).not.toHaveBeenCalled();
    });

    it('should call getNotifications when measureScrollOffset() is less than item height', async () => {
      const { component } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValueOnce(of({ data: [unreadUserNotification] }))
            .mockReturnValueOnce(of({ data: [readNotification] })),
        },
      });
      jest.spyOn(component, 'getNotifications');

      component.handleScrolledIndexChange({
        measureScrollOffset: () => 119,
      } as CdkVirtualScrollViewport);
      component.handleScrolledIndexChange({
        measureScrollOffset: () => 119,
      } as CdkVirtualScrollViewport);

      expect(component.getNotifications).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateFilter', () => {
    it('should show all', async () => {
      const { component } = await setup();
      component.hasMore = false;
      jest.spyOn(component, 'getNotifications');

      component.updateFilter({
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      expect(component.getNotifications).toHaveBeenCalled();
    });

    it('should show unread', async () => {
      const { component } = await setup();
      component.hasMore = false;
      jest.spyOn(component, 'getNotifications');

      component.updateFilter(
        {
          closed: { emit: jest.fn() },
        } as unknown as MatMenu,
        'unread'
      );

      expect(component.getNotifications).toHaveBeenCalled();
    });

    it('should show read', async () => {
      const { component } = await setup();
      component.hasMore = false;
      jest.spyOn(component, 'getNotifications');

      component.updateFilter(
        {
          closed: { emit: jest.fn() },
        } as unknown as MatMenu,
        'read'
      );

      expect(component.getNotifications).toHaveBeenCalled();
    });
  });

  describe('handleClick', () => {
    it('should call checkItOut and markAsRead when category is manual_update_enginetype and has vin', async () => {
      const { component } = await setup({
        ...defaultMock,
        notificationService: {
          ...notificationService,
          getNotifications: jest
            .fn()
            .mockReturnValue(of({ data: [unreadUserNotification] })),
        },
      });
      jest.spyOn(component, 'checkItOut');
      jest.spyOn(component, 'markAsRead');

      component.getNotifications(new Date());

      component.handleClick(0, {
        closed: { emit: jest.fn() },
      } as unknown as MatMenu);

      expect(component.checkItOut).toHaveBeenCalled();
      expect(component.markAsRead).toHaveBeenCalled();
    });
  });
});
