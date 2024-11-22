import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, parseJSON } from 'date-fns';
import { enUS, de, it, nl, pl, ro } from 'date-fns/locale';

const locales = new Map([
  ['en-US', enUS],
  ['de', de],
  ['it', it],
  ['nl', nl],
  ['pl', pl],
  ['ro', ro],
]);

@Pipe({
  name: 'distanceToNow',
  standalone: true,
})
export class DistanceToNowPipe implements PipeTransform {
  transform(
    value: Date | string | number | null | undefined,
    locale: string
  ): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      const date = parseJSON(value);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: locales.get(locale),
      });
    }

    if (typeof value === 'number') {
      return formatDistanceToNow(new Date(value), {
        addSuffix: true,
        locale: locales.get(locale),
      });
    }

    return formatDistanceToNow(value, {
      addSuffix: true,
      locale: locales.get(locale),
    });
  }
}
