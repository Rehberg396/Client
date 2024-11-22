import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'powertrainAnomalyType',
  standalone: true
})
export class PowertrainAnomalyTypesPipe implements PipeTransform {
  transform(type: string): string {
    if (type === 'COOLANT') {
      return $localize`Coolant Temperature Status`;
    } else if (type === 'OIL') {
      return $localize`Oil Temperature Status`;
    } else {
      return $localize`Unknown type`;
    }
  }
}
