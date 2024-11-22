export type InitialRequestStatus = { loadingState: 'initial' };
export type LoadingRequestStatus = { loadingState: 'loading' };
export type LoadedRequestStatus<T> = { loadingState: 'loaded'; data: T };
export type ErrorRequestStatus = { loadingState: 'error'; message: string };

export type RequestStatus<T> =
  | InitialRequestStatus
  | LoadingRequestStatus
  | LoadedRequestStatus<T>
  | ErrorRequestStatus;
