import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  LOCALE_ID,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { UserNotification } from '@cps/types';
import { DistanceToNowPipe } from '@cps/ui';
import {
  NotificationService,
  VehicleService,
} from '@cps/vehicle-health/data-access';
import { UpdateEngineTypeFormComponent } from '@cps/vehicle-health/vehicles/ui';
import {
  BehaviorSubject,
  catchError,
  map,
  mergeMap,
  of,
  startWith,
} from 'rxjs';
import { MetadataPipe } from './metadata.pipe';

const itemHeight = 120;
const limit = 5;

type Status = 'read' | 'unread';

@Component({
  selector: 'vh-notification',
  standalone: true,
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    DistanceToNowPipe,
    MatDividerModule,
    MatTooltipModule,
    MatChipsModule,
    ScrollingModule,
    AsyncPipe,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MetadataPipe,
  ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  locale = inject(LOCALE_ID);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private vehicleService = inject(VehicleService);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  filter = signal<'read' | 'unread' | undefined>(undefined);

  nextToken: Date | null = null;
  hasMore = true;
  private cache = new BehaviorSubject<UserNotification[]>([]);
  notifications$ = this.cache.asObservable();

  engineTypes$ = this.vehicleService.getEngineTypes().pipe(
    map((response) => response.data),
    catchError(() => of([])),
    startWith([])
  );

  private unreadCountSubject = new BehaviorSubject(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  ngOnInit() {
    this.notificationService
      .countUnreadNotifications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.unreadCountSubject.next(response.data);
        },
      });
  }

  opened = signal(false);
  isActive = signal(false);

  menuClosed() {
    this.opened.set(false);
    this.isActive.set(false);
  }

  menuOpened() {
    this.opened.set(true);
    this.isActive.set(true);
  }

  markAsRead(i: number, menu: MatMenu) {
    menu.closed.emit();
    const notification = this.cache.value[i];
    if (notification.messageStatus === 'read') {
      return;
    }
    this.updateMessageStatus(i, 'read');
    this.notificationService
      .update({ messageId: notification.id, command: 'MARK_AS_READ' })
      .subscribe({
        error: () => this.updateMessageStatus(i, 'unread'),
      });
  }

  markAsUnread(i: number, menu: MatMenu) {
    menu.closed.emit();
    const notification = this.cache.value[i];
    if (notification.messageStatus === 'unread') {
      return;
    }
    this.updateMessageStatus(i, 'unread');
    this.notificationService
      .update({ messageId: notification.id, command: 'MARK_AS_UNREAD' })
      .subscribe({
        error: () => this.updateMessageStatus(i, 'read'),
      });
  }

  private updateMessageStatus(i: number, status: Status) {
    const newCache = this.cache.value.map((notification, index) =>
      index === i ? { ...notification, messageStatus: status } : notification
    );
    this.updateCount(status);
    this.cache.next(newCache);
  }

  private updateCount(status: Status) {
    const currentValue = this.unreadCountSubject.value;
    if (status === 'read') {
      this.unreadCountSubject.next(currentValue - 1);
    } else {
      this.unreadCountSubject.next(currentValue + 1);
    }
  }

  updateEngineType(i: number, menu: MatMenu) {
    menu.closed.emit();
    const notification = this.cache.value[i];
    const dialogRef = this.dialog.open(UpdateEngineTypeFormComponent, {
      width: '44rem',
      disableClose: true,
      data: {
        options: {
          engineTypes$: this.engineTypes$,
        },
      },
    });
    const instance = dialogRef.componentInstance;
    instance.handleSubmit = (request) => {
      instance.isLoading.set(true);
      this.vehicleService
        .getByVin(notification.metadata['vin'])
        .pipe(
          mergeMap((response) =>
            this.vehicleService.edit({
              ...response.data,
              engineType: request.engineType,
            })
          ),
          mergeMap(() =>
            this.notificationService.update({
              messageId: notification.id,
              command: 'MASK_AS_UPDATED_ENGINE_TYPE',
            })
          )
        )
        .subscribe({
          next: () => {
            instance.isLoading.set(false);
            this.cache.next(this.cache.value.filter((_, index) => index !== i));
            dialogRef.close();
          },
        });
    };
  }

  checkItOut(i: number, notificationMenu: MatMenu) {
    notificationMenu.closed.emit();
    const notification = this.cache.value[i];
    this.router.navigate(['/vehicle'], {
      queryParams: {
        needManualUpdatedEngineType: true,
        search: notification.metadata['vin'],
      },
    });
  }

  handleScrolledIndexChange(viewport: CdkVirtualScrollViewport) {
    if (this.isLoading()) {
      return;
    }
    if (!this.hasMore) {
      return;
    }
    const scrollOffset = viewport.measureScrollOffset('bottom');
    if (scrollOffset > itemHeight) {
      return;
    }
    if (this.nextToken === null) {
      this.nextToken = new Date();
      this.getNotifications(this.nextToken);
      return;
    }
    this.getNotifications(this.nextToken);
  }

  getNotifications(date: Date) {
    this.isLoading.set(true);
    const jsonDate = date.toJSON();
    const currentStatus = this.filter();

    const filter = currentStatus
      ? {
          limit,
          timestamp: jsonDate,
          status: currentStatus,
        }
      : {
          limit,
          timestamp: jsonDate,
        };

    this.notificationService
      .getNotifications(filter)
      .pipe(map((response) => response.data))
      .subscribe({
        next: (data) => {
          this.isLoading.set(false);
          if (data.length === 0) {
            this.hasMore = false;
          } else {
            const newData = [...this.cache.value, ...data];
            const lastItem = newData[newData.length - 1];
            if (lastItem.createdDate) {
              this.nextToken = new Date(lastItem.createdDate);
            }
            this.cache.next(newData);
          }
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  updateFilter(menu: MatMenu, filter?: Status) {
    menu.closed.emit();
    this.filter.set(filter);
    this.hasMore = true;
    this.cache.next([]);
    this.getNotifications(new Date());
  }

  handleClick(i: number, menu: MatMenu) {
    const notification = this.cache.value[i];
    this.markAsRead(i, menu);
    if (
      notification.category === 'manual_update_enginetype' &&
      notification.metadata['vin']
    ) {
      this.checkItOut(i, menu);
    }
  }
}
