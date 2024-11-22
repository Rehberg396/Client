import { Provider } from '@angular/core';
import {
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginatorDefaultOptions,
  MatPaginatorIntl,
} from '@angular/material/paginator';

export function providePaginatorIntl(): Provider[] {
  const matRangeLabelIntl = (
    page: number,
    pageSize: number,
    length: number
  ) => {
    if (length === 0 || pageSize === 0) {
      return $localize`:@@paginator.zeroRange:0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;

    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return $localize`:@@paginator.rangeOfLabel:${
      startIndex + 1
    } - ${endIndex} of ${length}`;
  };

  return [
    {
      provide: MatPaginatorIntl,
      useFactory: () => {
        const paginatorIntl = new MatPaginatorIntl();
        paginatorIntl.itemsPerPageLabel = $localize`:@@paginator.displayPerPage:Items per page`;
        paginatorIntl.nextPageLabel = $localize`:@@paginator.nextPage:Next page`;
        paginatorIntl.previousPageLabel = $localize`:@@paginator.prevPage:Previous page`;
        paginatorIntl.firstPageLabel = $localize`:@@paginator.firstPage:First page`;
        paginatorIntl.lastPageLabel = $localize`:@@paginator.lastPage:Last page`;
        paginatorIntl.getRangeLabel = matRangeLabelIntl;
        return paginatorIntl;
      },
    },
    {
      provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
      useValue: {
        pageSizeOptions: [5, 10, 20],
        showFirstLastButtons: true,
      } as MatPaginatorDefaultOptions,
    },
  ];
}
