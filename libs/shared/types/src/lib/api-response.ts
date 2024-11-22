export interface ApiResponseModel<T> {
  data: T;
  code: string;
  timestamp: string;
}

export interface ApiErrorResponseModel {
  code: string;
  message: string;
  timestamp: string;
  status: string;
  path: string;
  cause: string;
  details: DetailsErrorResponseModel[];
}

export interface DetailsErrorResponseModel {
  object: string;
  field: string;
  rejectedValue: unknown;
  message: string;
}

export interface PagingResponseModel<T> extends ListResponseModel<T> {
  page: PageModel;
}

export interface ListResponseModel<T> {
  content: T[];
  links: LinkModel[];
}

export interface PageModel {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface LinkModel {
  rel: string;
  href: string;
}

export interface Page<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
