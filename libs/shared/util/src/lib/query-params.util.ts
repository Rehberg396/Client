export function toInteger(value: unknown, defaultValue?: number) {
  if (typeof value === 'number') {
    return Math.trunc(value);
  }
  if (typeof value === 'string') {
    const parsedValue = Number.parseInt(value);
    if (!Number.isNaN(parsedValue)) {
      return Math.trunc(parsedValue);
    }
  }
  return defaultValue ?? 0;
}

export function toPageNumber(value: unknown) {
  return toInteger(value);
}

export function toPageSize(value: unknown) {
  const newValue = toInteger(value, 10);
  if (newValue >= 15) {
    return 20;
  }
  if (newValue > 5 && newValue < 15) {
    return 10;
  }
  return 5;
}

export function toSortDirection(value: unknown) {
  if (value === 'asc' || value === 'desc') {
    return value;
  }
  return '';
}

export function toStringParam(value: unknown, defaultValue = '') {
  if (typeof value === 'string') {
    return value;
  }
  return defaultValue;
}

export function toSortParam(value: { active: string; direction: string }) {
  if (value.active !== '' && value.direction !== '') {
    return `${value.active},${value.direction}`;
  }
  return undefined;
}

export function serializeFilters(filters: Record<string, string[]>) {
  return Object.entries(filters)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => `${k}:${v.join(',')}`)
    .join(';');
}

export function deserializeFilters(
  value: unknown
): Record<string, Set<string>> {
  if (typeof value !== 'string') {
    return {};
  }
  return value.split(';').reduce(
    (acc, filter) => {
      const arr = filter.split(':').map((object) => object.split(','));
      const key = arr[0];
      const value = arr[1];
      if (key.length === 1) {
        acc[key[0]] = new Set(value);
      }
      return acc;
    },
    {} as Record<string, Set<string>>
  );
}

export function serializeDisplayedColumns(value: string[]) {
  return value.join(',');
}

export function deserializeDisplayedColumns(value: unknown) {
  const displayedColumns = new Set(
    typeof value === 'string' ? value.split(',') : ['*']
  );

  return {
    isHidden: (key: string) =>
      !(displayedColumns.has('*') || displayedColumns.has(key)),
  };
}
