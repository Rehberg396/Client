import { HttpClient } from '@angular/common/http';
import { inject, Provider } from '@angular/core';
import {
  BatteryHealthService,
  DiagnosticService,
  DtcTemplateService,
  FleetService,
  PowertrainAnomalyService,
  VehicleService,
} from './services';
import { DtcCategoryGroupService } from './services/dtc-category-group.service';
import { ContactService } from './services/contact.service';
import { NotificationService } from './services/notification.service';

export type ApiServices = {
  vh: string;
  sm: string;
};

export function provideApiServices({ vh, sm }: ApiServices): Provider[] {
  return [
    {
      provide: DtcCategoryGroupService,
      useFactory: () => {
        return new DtcCategoryGroupService(vh, inject(HttpClient));
      },
    },
    {
      provide: DtcTemplateService,
      useFactory: () => {
        return new DtcTemplateService(vh, inject(HttpClient));
      },
    },
    {
      provide: VehicleService,
      useFactory: () => {
        return new VehicleService(vh, inject(HttpClient));
      },
    },
    {
      provide: FleetService,
      useFactory: () => {
        return new FleetService(vh, inject(HttpClient));
      },
    },
    {
      provide: BatteryHealthService,
      useFactory: () => {
        return new BatteryHealthService(vh, inject(HttpClient));
      },
    },
    {
      provide: ContactService,
      useFactory: () => {
        return new ContactService(vh, inject(HttpClient));
      },
    },
    {
      provide: PowertrainAnomalyService,
      useFactory: () => {
        return new PowertrainAnomalyService(vh, inject(HttpClient));
      },
    },
    {
      provide: NotificationService,
      useFactory: () => {
        return new NotificationService(sm, inject(HttpClient));
      },
    },
    {
      provide: DiagnosticService,
      useFactory: () => {
        return new DiagnosticService(vh, inject(HttpClient));
      },
    },
  ];
}
