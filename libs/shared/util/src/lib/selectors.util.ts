import { Observable, filter, map, startWith } from 'rxjs';

import {
  ErrorRequestStatus,
  LoadedRequestStatus,
  PagingResponseModel,
  RequestStatus,
} from '@cps/types';

export function getLoadedData<T>(value: Observable<RequestStatus<T>>) {
  return value.pipe(
    filter(
      (status): status is LoadedRequestStatus<T> =>
        status.loadingState === 'loaded'
    )
  );
}

export function isLoadingStatus<T>(value: Observable<RequestStatus<T>>) {
  return value.pipe(map((status) => status.loadingState === 'loading'));
}

export function getError<T>(value: Observable<RequestStatus<T>>) {
  return value.pipe(
    filter(
      (status): status is ErrorRequestStatus => status.loadingState === 'error'
    )
  );
}

export function unwrapData<T>(loadedData: Observable<LoadedRequestStatus<T>>) {
  return loadedData.pipe(map((d) => d.data));
}

export function unwrapPaging<T>(
  source: Observable<RequestStatus<PagingResponseModel<T>>>
) {
  const loadedData = getLoadedData(source);
  const isLoading$ = isLoadingStatus(source);

  const errorMessage$ = getError(source).pipe(
    map((d) => d.message),
    startWith('')
  );

  const dataSource$ = loadedData.pipe(
    map((d) => d.data.content),
    startWith([] as T[])
  );

  const totalElements$ = loadedData.pipe(
    map((d) => d.data.page.totalElements),
    startWith(0)
  );

  return {
    dataSource$,
    totalElements$,
    isLoading$,
    errorMessage$,
  };
}
