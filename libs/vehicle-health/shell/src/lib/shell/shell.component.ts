import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
  Scroll,
} from '@angular/router';
import { ToastService } from '@cps/ui';
import { BROWSER_LOCATION } from '@cps/util';
import { AuthService, UserInfoComponent } from '@cps/vehicle-health/auth';
import { CheckForUpdateService } from '@cps/vehicle-health/check-for-update';
import { VH_ENVIRONMENT } from '@cps/vehicle-health/config';
import {
  CustomerContextComponent,
  CustomerService,
} from '@cps/vehicle-health/customer';
import { DisclaimerService } from '@cps/vehicle-health/disclaimers/ui';
import { NotificationComponent } from '@cps/vehicle-health/notification';
import { filter, map } from 'rxjs';
import {
  Breadcrumb,
  BreadcrumbComponent,
} from '../breadcrumb/breadcrumb.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { MainComponent } from '../main/main.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { SupergraphicComponent } from '../supergraphic/supergraphic.component';

import { computed } from '@angular/core'; //Löschen nach API implementierung

@Component({
  selector: 'vh-shell',
  standalone: true,
  imports: [
    RouterModule,
    SupergraphicComponent,
    FooterComponent,
    HeaderComponent,
    SidenavComponent,
    MainComponent,
    RouterOutlet,
    AsyncPipe,
    BreadcrumbComponent,
    CustomerContextComponent,
    NotificationComponent,
    UserInfoComponent,
    MatTooltipModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(BROWSER_LOCATION);
  private readonly env = inject(VH_ENVIRONMENT);

  private readonly authService = inject(AuthService);
  private readonly customerService = inject(CustomerService);
  private readonly checkForUpdateService = inject(CheckForUpdateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly disclaimerService = inject(DisclaimerService);

  authState = this.authService.authState;
  customers = computed(() => ["BOSCH"]); //this.customerService.customers;
  currentCustomer = computed(() => "BOSCH"); //this.customerService.customerContext;

  ngOnInit(): void {
    this.registerDisclaimer();
    this.registerCheckForUpdate();
  }

  breadcrumbs$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd || e instanceof Scroll),
    map(() => this.createBreadcrumbs(this.route.root))
  );

  isEnabledCheckForUpdate = false;//this.checkForUpdateService.isEnabled; TO-DO
  numberOfNewVersions = signal(0);

  private registerDisclaimer() {
    const authState = this.authService.authState();
    if (authState.isAuthenticated && authState.userInfo.hasAnyPermission()) {
      this.disclaimerService.openDialog();
    }
  }

  private registerCheckForUpdate() {
    if (this.isEnabledCheckForUpdate) {
      this.checkForUpdateService
        .versionUpdates()
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          filter((e) => e.type === 'VERSION_READY')
        )
        .subscribe(() => {
          this.numberOfNewVersions.update((value) => value + 1);
          this.toastService.success($localize`A new version is available.`);
        });
      this.checkForUpdateService
        .intervalCheckUpdate(this.env.checkForUpdateRate)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe();
    }
  }

  checkForUpdate() {
    this.checkForUpdateService
      .checkForUpdate()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (versionReady) => {
          if (!versionReady) {
            if (this.numberOfNewVersions() > 0) {
              this.toastService.success($localize`A new version is available.`);
            } else {
              this.toastService.success(
                $localize`Already on the latest version.`
              );
            }
          }
        },
        error: () => {
          this.toastService.error(
            $localize`Error occur when check for update.`
          );
        },
      });
  }

  async changeCustomer(value: string) {
    this.customerService.changeCustomerContext(value);
    await this.router.navigateByUrl('/');
    this.location.reload();
  }

  onLogout(): void {
    this.authService.logout();
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    for (const child of children) {
      const routeURL = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const breadcrumb = child.snapshot.data['breadcrumb'];
      const defaultQueryParams = child.snapshot.data['defaultQueryParams'];

      if (breadcrumb) {
        breadcrumbs.push({ label: breadcrumb, url, defaultQueryParams });
      }

      this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
