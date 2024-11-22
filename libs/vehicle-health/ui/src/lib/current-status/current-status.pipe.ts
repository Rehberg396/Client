import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentStatus',
  standalone: true,
})
export class CurrentStatusPipe implements PipeTransform {
  transform(status?: string): string {
    switch (status) {
      case 'Active':
        return $localize`The latest fault was received at a time less than 1 day at`;
      case 'Offline':
        return $localize`The latest fault was received at a time greater than 1 day at`;
      default:
        return '';
    }
  }
}
