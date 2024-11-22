export type QueryParams = {
  [param: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string | number | boolean>;
};

export type QueryState = {
  page: number;
  size: number;
  search?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc' | '';
  filters?: string;
  displayedColumns?: string;
};
