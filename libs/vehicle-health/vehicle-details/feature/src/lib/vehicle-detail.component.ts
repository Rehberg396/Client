import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DtcTemplateGroup, RequestStatus } from '@cps/types';
import {
  LeafletMapComponent,
  NotAvailableComponent,
  SkeletonLoadingComponent,
} from '@cps/ui';
import { VH_ENVIRONMENT } from '@cps/vehicle-health/config';
import { DividerComponent, VehicleImageComponent } from '@cps/vehicle-health/ui';
import { VehicleDetailStore } from '@cps/vehicle-health/vehicle-details/data-access';
import {
  VehicleDetailInfoComponent,
  VehicleDetailTableComponent,
} from '@cps/vehicle-health/vehicle-details/ui';
import { provideComponentStore } from '@ngrx/component-store';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  interval,
  map,
} from 'rxjs';

@Component({
  selector: 'vh-vehicle-detail',
  standalone: true,
  imports: [
    VehicleDetailInfoComponent,
    VehicleDetailTableComponent,
    AsyncPipe,
    VehicleImageComponent,
    SkeletonLoadingComponent,
    LeafletMapComponent,
    NotAvailableComponent,
    DividerComponent,
  ],
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(VehicleDetailStore)],
})
export class VehicleDetailComponent implements OnInit {
  private readonly store = inject(VehicleDetailStore);
  private readonly env = inject(VH_ENVIRONMENT);
  private readonly destroyRef = inject(DestroyRef);

  vehicle$ = this.store.selectors.vehicle$;
  fleetOverview$ = this.store.selectors.fleetOverview$;
  dtcGroup$ = this.store.selectors.dtcGroup$;
  batteryHealth$ = this.store.selectors.batteryHealth$;
  powertrainAnomaly$ = this.store.selectors.powertrainAnomaly$;
  powertrainAnomalyHistory$ = this.store.selectors.powertrainAnomalyHistory$;

  vin = input.required<string>();
  vin$ = toObservable(this.vin);

  expandedElement: string | null = null;

  ngOnInit(): void {
    const vin = this.vin();
    this.store.loadVehicle(vin);
    this.store.loadOneFleetOverview(vin);
    this.store.loadBatteryHealth(vin);
    this.store.loadDtcGroup(vin);
    this.store.loadPowertrainAnomaly(vin);

    interval(this.env.refreshRate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.store.refresh(vin));
  }

  private readonly criticalitySelectedAction = new BehaviorSubject<string>('');
  seletedCriticality$ = this.criticalitySelectedAction.asObservable();

  filteredDtcGroup$: Observable<RequestStatus<DtcTemplateGroup[]>> =
    combineLatest([this.seletedCriticality$, this.dtcGroup$]).pipe(
      map(([selectedCriticality, dtcGroup]) => {
        if (selectedCriticality === '') {
          return dtcGroup;
        }
        if (dtcGroup.loadingState === 'loaded') {
          return {
            ...dtcGroup,
            data: dtcGroup.data.filter(
              (dtcGroup) => dtcGroup.criticality === selectedCriticality
            ),
          };
        }
        return dtcGroup;
      })
    );

  vm$ = combineLatest([
    this.vehicle$,
    this.fleetOverview$,
    this.filteredDtcGroup$,
    this.batteryHealth$,
    this.powertrainAnomaly$,
    this.vin$,
    this.powertrainAnomalyHistory$
  ]).pipe(
    map(
      ([
        vehicle,
        fleetOverview,
        dtcGroup,
        batteryHealth,
        powertrainAnomaly,
        vin,
        powertrainAnomalyHistory
      ]) => ({
        vehicle,
        fleetOverview,
        dtcGroup,
        batteryHealth,
        powertrainAnomaly,
        dataSource: {
          batteryHealth,
          dtcGroup,
          powertrainAnomaly,
          powertrainAnomalyHistory
        },
        vin,
      })
    )
  );

  onFilterCriticality(criticality: string): void {
    this.expandedElement = null;
    this.criticalitySelectedAction.next(criticality);
  }

  onToggle(item: string) {
    this.expandedElement = this.expandedElement === item ? null : item;
  }

  onLoadPowertrainHistory(vin: string) {
    this.store.loadPowertrainAnomalyHistory(vin);
  }
}
