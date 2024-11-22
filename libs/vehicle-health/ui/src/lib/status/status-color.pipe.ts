import { Pipe, PipeTransform } from '@angular/core';
import { NO_STATUS_DEFINED_COLOR, StatusColors } from './status.const';

@Pipe({
  name: 'statusLevelColor',
  standalone: true,
})
export class StatusLevelColorPipe implements PipeTransform {
  transform(value: number | string | undefined): string | undefined {
    const cast = typeof value === 'string' ? +value : value;
    return StatusColors.get(cast ?? 0) ?? NO_STATUS_DEFINED_COLOR;
  }
}
