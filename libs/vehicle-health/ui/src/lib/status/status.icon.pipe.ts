import { Pipe, PipeTransform } from '@angular/core';
import { NO_STATUS_DEFINED_ICON, StatusIcons } from './status.const';

@Pipe({
  name: 'statusLevelIcon',
  standalone: true,
})
export class StatusLevelIconPipe implements PipeTransform {
  transform(value: number | string | undefined): string | undefined {
    const cast = typeof value === 'string' ? +value : value;
    return StatusIcons.get(cast ?? 0) ?? NO_STATUS_DEFINED_ICON;
  }
}
