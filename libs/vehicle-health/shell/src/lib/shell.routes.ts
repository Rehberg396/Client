import { Routes } from '@angular/router';
import { NotFoundComponent } from '@cps/ui';
import {
  AccessDeniedComponent,
  permissionGuard,
} from '@cps/vehicle-health/auth';
import { ShellComponent } from './shell/shell.component';

export const vehicleHealthRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    canMatch: [permissionGuard],
    children: [
      {
        path: '',
        redirectTo: '/fleet-overview',
        pathMatch: 'full',
      },
      {
        path: 'fleet-overview',
        data: {
          breadcrumb: $localize`Fleet Overview`,
          defaultQueryParams: {
            page: '0',
            size: '10',
          },
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('@cps/vehicle-health/fleets/overview/feature').then(
                (c) => c.FleetOverviewComponent
              ),
            data: {
              breadcrumb: null,
              defaultQueryParams: null,
            },
            title: $localize`Fleet Overview`,
          },
          {
            path: 'vehicle',
            data: {
              breadcrumb: null,
              defaultQueryParams: null,
            },
            children: [
              {
                path: ':vin',
                data: {
                  breadcrumb: $localize`Vehicle Details`,
                  defaultQueryParams: null,
                },
                children: [
                  {
                    path: '',
                    loadComponent: () =>
                      import(
                        '@cps/vehicle-health/vehicle-details/feature'
                      ).then((c) => c.VehicleDetailComponent),
                    data: {
                      breadcrumb: null,
                      defaultQueryParams: null,
                    },
                    title: $localize`Vehicle Details`,
                  },
                  {
                    path: 'faults',
                    loadComponent: () =>
                      import('@cps/vehicle-health/vehicle-faults/feature').then(
                        (c) => c.FeatVehicleFaultsComponent
                      ),
                    data: {
                      breadcrumb: $localize`Vehicle Faults`,
                      defaultQueryParams: null,
                    },
                    title: $localize`Vehicle Faults`,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'dtc-management',
        loadComponent: () =>
          import('@cps/vehicle-health/dtc-templates/feature').then(
            (c) => c.DtcTemplateComponent
          ),
        data: {
          breadcrumb: $localize`DTC Management`,
          defaultQueryParams: {
            page: '0',
            size: '10',
          },
        },
        title: $localize`DTC Management`,
      },
      {
        path: 'vehicle',
        loadComponent: () =>
          import('@cps/vehicle-health/vehicles/feature').then(
            (c) => c.VehicleComponent
          ),
        data: {
          breadcrumb: $localize`Vehicle Management`,
          defaultQueryParams: {
            page: '0',
            size: '10',
          },
        },
        title: $localize`Vehicle`,
      },
      {
        path: 'diagnostic',
        loadComponent: () =>
          import('@cps/vehicle-health/diagnostic/feature').then(
            (c) => c.VehicleDiagnosticComponent
          ),
        data: {
          breadcrumb: $localize`Vehicle Diagnostic`,
          defaultQueryParams: null,
        },
        title: $localize`Diagnostic`,
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('@cps/vehicle-health/contact/feature').then(
            (c) => c.ContactComponent
          ),
        data: {
          breadcrumb: $localize`Contact`,
        },
        title: $localize`Contact`,
      },
      {
        path: 'disclaimer',
        loadComponent: () =>
          import('@cps/vehicle-health/disclaimers/feature').then(
            (c) => c.DisclaimerComponent
          ),
        data: {
          breadcrumb: $localize`Disclaimer`,
        },
        title: $localize`Disclaimer`,
      },
      {
        path: 'about',
        loadComponent: () =>
          import('@cps/vehicle-health/about').then((c) => c.AboutComponent),
        data: {
          breadcrumb: $localize`About`,
        },
        title: $localize`About`,
      },
      {
        path: '**',
        component: NotFoundComponent,
        data: {
          breadcrumb: $localize`Not Found`,
        },
        title: $localize`Not Found`,
      },
    ],
  },
  {
    path: '**',
    component: AccessDeniedComponent,
  },
];
