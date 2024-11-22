import { Pipe, PipeTransform } from '@angular/core';
import { UserNotification } from '@cps/types';

@Pipe({
  name: 'metadata',
  standalone: true,
})
export class MetadataPipe implements PipeTransform {
  transform(value: UserNotification) {
    if (value.category !== 'manual_update_enginetype') {
      return '';
    }
    if (value.metadata['licensePlate']) {
      return `[${value.metadata['licensePlate']}]`;
    }
    if (value.metadata['vin']) {
      return `[${value.metadata['vin']}]`;
    }
    return '';
  }
}
