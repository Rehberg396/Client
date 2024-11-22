import { Pipe, PipeTransform } from '@angular/core';
import { NO_RISK_DEFINED_COLOR, RiskColors } from './risks.const';

@Pipe({
  name: 'riskLevelColor',
  standalone: true,
})
export class RiskLevelColorPipe implements PipeTransform {
  transform(value: number | string | undefined): string | undefined {
    const cast = typeof value === 'string' ? +value : value;
    return RiskColors.get(cast ?? 0) ?? NO_RISK_DEFINED_COLOR;
  }
}
