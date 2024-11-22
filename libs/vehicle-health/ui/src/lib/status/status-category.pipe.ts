import { Pipe, PipeTransform } from '@angular/core';
import { NO_STATUS_DEFINED_CATEGORY, StatusCategories } from './status.const';

@Pipe({
  name: 'statusLevelCategory',
  standalone: true,
})
export class StatusLevelCategoryPipe implements PipeTransform {
  transform(value: number | string | undefined): string | undefined {
    const cast = typeof value === 'string' ? +value : value;
    return StatusCategories.get(cast ?? 0) ?? NO_STATUS_DEFINED_CATEGORY;
  }
}
