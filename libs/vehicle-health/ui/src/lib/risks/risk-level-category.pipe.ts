import { Pipe, PipeTransform } from '@angular/core';
import { risks } from './risks.const';

@Pipe({
  name: 'riskLevelCategory',
  standalone: true,
})
export class RiskLevelCategoryPipe implements PipeTransform {
  transform(riskLevel: number): string {
    const risk = risks.find((r) => r.level === riskLevel);
    return risk ? risk.category : $localize`No Risk`;
  }
}
