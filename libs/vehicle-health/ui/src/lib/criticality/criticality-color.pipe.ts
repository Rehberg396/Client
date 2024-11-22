import { Pipe, PipeTransform } from '@angular/core';
import {
  CriticalityColor,
  CriticalityLevel,
  CriticalityLevelToColorMap,
} from './criticality.const';

@Pipe({
  name: 'criticalityColor',
  standalone: true,
})
export class CriticalityColorPipe implements PipeTransform {
  transform(value: CriticalityLevel): CriticalityColor | undefined {
    return CriticalityLevelToColorMap.get(value);
  }
}
