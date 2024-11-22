import { Pipe, PipeTransform } from '@angular/core';
import { batteryColorMap, colors } from './battery-color.const';

@Pipe({
  name: 'batteryColor',
  standalone: true,
})
export class BatteryColorPipe implements PipeTransform {
  transform(value: number) {
    return batteryColorMap.get(value) ?? colors[0].color;
  }
}
