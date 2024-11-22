import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { divIcon, latLng, Map, MapOptions, Marker, tileLayer } from 'leaflet';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'vh-leaflet-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './leaflet-map.component.html',
})
export class LeafletMapComponent {
  private readonly destroyRef = inject(DestroyRef);

  latLng = input.required<[number, number]>();
  popup = input.required<string>();

  latLng$ = toObservable(this.latLng);
  popup$ = toObservable(this.popup);

  vm$ = combineLatest([this.latLng$, this.popup$]).pipe(
    map(([latLng, popup]) => ({
      latLng: {
        lat: latLng[0],
        lng: latLng[1],
      },
      popup,
    })),
    takeUntilDestroyed(this.destroyRef)
  );

  options = computed<MapOptions>(() => {
    const ll = this.latLng();
    return {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
      zoom: 15,
      center: latLng(ll[0], ll[1]),
    };
  });

  onReady(m: Map) {
    const latLng = this.latLng();
    const marker = new Marker(
      {
        lat: latLng[0],
        lng: latLng[1],
      },
      {
        icon: divIcon({
          className: 'bosch-ic bosch-ic-car-locator marker-icon',
          iconSize: [32, 32],
        }),
      }
    )
      .addTo(m)
      .bindPopup(this.popup())
      .openPopup();

    this.vm$.subscribe((value) => {
      marker.setLatLng(value.latLng);
      m.setView(value.latLng);
      marker.getPopup()?.setContent(value.popup);
    });
  }
}
