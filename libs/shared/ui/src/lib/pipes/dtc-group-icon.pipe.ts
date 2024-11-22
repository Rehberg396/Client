import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dtcGroupIcon',
  standalone: true,
})
export class DtcGroupIconPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'Aftertreatment System':
        return 'bosch-ic-car-mechanic';
      case 'Assistance, Comfort & Information':
        return 'bosch-ic-security-street';
      case 'Battery and Electrics':
        return 'bosch-ic-engine-battery-flash';
      case 'Braking System':
        return 'bosch-ic-brake-disk';
      case 'Cooling System':
        return 'bosch-ic-fan-heat';
      case 'Exhaust System':
        return 'bosch-ic-exhaust-pipe';
      case 'Fuel Cell':
        return 'bosch-ic-fuel-cell';
      case 'Other':
        return 'bosch-ic-batch';
      case 'Passenger Safety':
        return 'bosch-ic-airbag';
      case 'Propulsion System':
        return 'bosch-ic-car-side-engine-flash';
      default:
        return 'bosch-ic-wrench';
    }
  }
}
