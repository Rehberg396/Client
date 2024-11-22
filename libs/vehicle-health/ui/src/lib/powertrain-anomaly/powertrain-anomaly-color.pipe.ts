import { Pipe, PipeTransform } from '@angular/core';
import {
  AnomalyColors,
  UNKNOWN_DEFINED_COLOR,
} from './powertrain-anomaly-color.const';

@Pipe({
  name: 'powertrainAnomalyColor',
  standalone: true,
})
export class PowertrainAnomalyColorPipe implements PipeTransform {
  transform(value: number | null): string {
    return AnomalyColors.get(value) ?? UNKNOWN_DEFINED_COLOR;
  }
}
