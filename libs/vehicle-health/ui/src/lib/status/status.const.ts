export const status = [
  {
    name: 'Pending',
    level: 1,
    color: '#71767c',
    icon: 'bosch-ic-circle-blank',
    category: $localize`Critical`, //TO-DO
  },
  {
    name: 'Running',
    level: 2,
    color: '#71767c',
    icon: 'bosch-ic-circle-blank',
    category: $localize`Minor`,
  },
  {
    name: 'Completed',
    level: 3,
    color: '#00884a',
    icon: 'bosch-ic-alert-success',
    category: $localize`Minor`,
  },
  {
    name: 'Failed',
    level: 4,
    color: '#ed0007',
    icon: 'bosch-ic-abort-frame',
    category: $localize`Minor`,
  },
] as const;

export const NO_STATUS_DEFINED_COLOR = '#71767c' as const;
export const NO_STATUS_DEFINED_ICON = '#bosch-ic-circle-blank' as const;
export const NO_STATUS_DEFINED_CATEGORY = 'pending' as const;

export type StatusArray = typeof status;
export type StatusLevel = StatusArray[number]['level'];
export type StatusColor =
  | StatusArray[number]['color']
  | typeof NO_STATUS_DEFINED_COLOR;

  export type StatusIcon =
  | StatusArray[number]['icon']
  | typeof NO_STATUS_DEFINED_ICON;

  export type StatusCategory =
  | StatusArray[number]['name']
  | typeof NO_STATUS_DEFINED_CATEGORY;

export type Status = StatusArray[number];

export const Statuses = new Map<StatusLevel, Status>(status.map((s) => [s.level, s]));

export const StatusColors = new Map<number, StatusColor>(
  status.map((s) => [s.level, s.color])
);

export const StatusIcons = new Map<number, StatusIcon>(
  status.map((s) => [s.level, s.icon])
);

export const StatusCategories = new Map<number, StatusCategory>(
  status.map((s) => [s.level, s.name])
);
