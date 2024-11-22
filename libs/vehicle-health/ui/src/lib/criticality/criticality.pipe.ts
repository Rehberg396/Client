import { Pipe, PipeTransform } from '@angular/core';
import {
  Criticality,
  CriticalityMap,
  CriticalityValue,
} from './criticality.const';

@Pipe({
  name: 'criticality',
  standalone: true,
})
export class CriticalityPipe implements PipeTransform {
  transform(value: string): Criticality | undefined {
    return CriticalityMap.get(value as CriticalityValue);
  }
}
