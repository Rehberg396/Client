import {
  deserializeDisplayedColumns,
  deserializeFilters,
  serializeDisplayedColumns,
  serializeFilters,
  toInteger,
  toPageNumber,
  toPageSize,
  toSortDirection,
  toSortParam,
  toStringParam,
} from './query-params.util';

describe('query-params.util', () => {
  it('toInteger', () => {
    expect(toInteger('1')).toBe(1);
    expect(toInteger(1.2)).toBe(1);
    expect(toInteger('xxx')).toBe(0);
    expect(toInteger('xxx', 1)).toBe(1);
  });

  it('toPageNumber', () => {
    expect(toPageNumber('1')).toBe(1);
  });

  it('toPageSize', () => {
    expect(toPageSize('21')).toBe(20);
    expect(toPageSize('20')).toBe(20);
    expect(toPageSize('15')).toBe(20);
    expect(toPageSize('11')).toBe(10);
    expect(toPageSize('10')).toBe(10);
    expect(toPageSize('6')).toBe(10);
    expect(toPageSize('5')).toBe(5);
    expect(toPageSize('4')).toBe(5);
  });

  it('toSortDirection', () => {
    expect(toSortDirection('asc')).toBe('asc');
    expect(toSortDirection('desc')).toBe('desc');
    expect(toSortDirection('')).toBe('');
    expect(toSortDirection('10')).toBe('');
  });

  it('toStringParam', () => {
    expect(toStringParam('asc')).toBe('asc');
    expect(toStringParam(111, 'desc')).toBe('desc');
  });

  it('toSortParam', () => {
    expect(toSortParam({ active: 'name', direction: 'asc' })).toBe('name,asc');
    expect(toSortParam({ active: 'name', direction: '' })).toBe(undefined);
    expect(toSortParam({ active: '', direction: 'asc' })).toBe(undefined);
    expect(toSortParam({ active: '', direction: '' })).toBe(undefined);
  });

  it('serializeFilters', () => {
    expect(serializeFilters({ filter1: ['a', 'b'], filter2: ['c', 'd'] })).toBe(
      'filter1:a,b;filter2:c,d'
    );
  });

  it('deserializeFilters', () => {
    const filters = deserializeFilters('filter1:a,b;filter2:c,d');
    expect(filters['filter1'].has('a')).toBe(true);
    expect(filters['filter1'].has('b')).toBe(true);
    expect(filters['filter2'].has('c')).toBe(true);
    expect(filters['filter2'].has('d')).toBe(true);

    expect(deserializeFilters({})).toEqual({});
    expect(deserializeFilters(1)).toEqual({});
  });

  it('serializeDisplayedColumns', () => {
    expect(serializeDisplayedColumns(['a', 'b'])).toBe('a,b');
  });

  it('deserializeDisplayedColumns', () => {
    const result = deserializeDisplayedColumns('a,b');
    expect(result.isHidden('a')).toBe(false);
    expect(result.isHidden('b')).toBe(false);
    expect(result.isHidden('c')).toBe(true);

    const result2 = deserializeDisplayedColumns({});
    expect(result2.isHidden('a')).toBe(false);
  });
});
