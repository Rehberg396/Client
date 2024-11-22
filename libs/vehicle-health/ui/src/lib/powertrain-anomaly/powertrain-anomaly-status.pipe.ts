import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'powertrainAnomalyStatus',
  standalone: true,
})
export class PowertrainAnomalyStatusPipe implements PipeTransform {
  transform(type: string, status: number | null): string {
    if (type === 'OIL') {
      switch (status) {
        case 0:
          return $localize`Normal Oil Temperature detected`;
        case 1:
          return $localize`Oil Over Temperature detected`;
        case 2:
          return $localize`Critical Oil Over Temperature detected`;
        default:
          return $localize`Unknown Oil Temperature status`;
      }
    } else if (type === 'COOLANT') {
      switch (status) {
        case 0:
          return $localize`Normal Coolant Temperature detected`;
        case 1:
          return $localize`Coolant Over Temperature detected`;
        case 2:
          return $localize`Critical Coolant Over Temperature detected`;
        default:
          return $localize`Unknown Coolant Temperature status`;
      }
    } else {
      return $localize`Unknown type`;
    }
  }
}
