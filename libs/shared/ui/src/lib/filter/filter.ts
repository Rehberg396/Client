export interface SelectOption {
  label: string;
  value: unknown;
  isChecked?: boolean;
}

export interface FilterOption {
  key: string;
  title: string;
  isChecked?: boolean;
  selectOption: SelectOption[];
}
