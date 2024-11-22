import { TemplateRef } from '@angular/core';

export type TableColumnConfig<T> = {
  label: string;
  canSort?: boolean;
  key: keyof T & string;
} & (
  | {
      type: 'text';
    }
  | {
      type: 'date' | 'number';
      format?: string;
    }
  | {
      type: 'templateRef';
      templateRef: () => TemplateRef<unknown>;
    }
);

export type TextColumn = {
  type: 'text';
};

export type FormattableColumn = {
  type: 'date' | 'number' | 'string';
  format?: string;
};

export type TemplateColumn = {
  type: 'templateRef';
  templateRef: () => TemplateRef<unknown>;
};

export type ActionColumn<T> = {
  type: 'action';
  actions: {
    icon: (value: T) => string;
    tooltip?: (value: T) => string;
    onClick?: (value: T) => void;
    disable?: (value: T) => boolean | undefined;
  }[];
};

export type SelectionColumn<T> = {
  type: 'selection';
};

export type ColumnConfig<T> = {
  key: string;
  label: string;
  hidden?: boolean;
  canSort?: boolean;
  minWidth?: string;
} & (
  | TextColumn
  | FormattableColumn
  | TemplateColumn
  | ActionColumn<T>
  | SelectionColumn<T>
);
