import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'odometerToKm',
  standalone: true,
})
export class OdometerToKmPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null) {
      return '';
    }

    if (value === undefined) {
      return '';
    }

    return (value / 1000).toLocaleString() + ' km';
  }
}
