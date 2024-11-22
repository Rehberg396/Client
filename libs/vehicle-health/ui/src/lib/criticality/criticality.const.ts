export const criticalities = [
  {
    value: 'Serious',
    icon: 'bosch-ic-alert-error-filled',
    field: 'serious',
    level: 1,
    color: '#a80003',
  },
  {
    value: 'Manufacturer Specific',
    icon: 'bosch-ic-alert-info-filled',
    field: 'manufacturerSpecific',
    level: 2,
    color: '#9e2896',
  },
  {
    value: 'High',
    icon: 'bosch-ic-alert-error-filled',
    field: 'high',
    level: 3,
    color: '#ed0007',
  },
  {
    value: 'Medium',
    icon: 'bosch-ic-alert-info-filled',
    field: 'medium',
    level: 4,
    color: '#fa6800',
  },
  {
    value: 'Low',
    icon: 'bosch-ic-alert-info-filled',
    field: 'low',
    level: 5,
    color: '#ffcf00',
  },
  {
    value: 'No criticality',
    icon: 'bosch-ic-alert-success-filled',
    field: 'noCriticality',
    level: 6,
    color: '#00884a',
  },
] as const;

export type CriticalityArray = typeof criticalities;
export type CriticalityValue = CriticalityArray[number]['value'];
export type CriticalityIcon = CriticalityArray[number]['icon'];
export type CriticalityLevel = CriticalityArray[number]['level'];
export type CriticalityColor = CriticalityArray[number]['color'];
export type Criticality = CriticalityArray[number];

export const CriticalityMap = new Map<CriticalityValue, Criticality>(
  criticalities.map((v) => [v.value, v])
);

export const CriticalityLevelToColorMap = new Map<
  CriticalityLevel,
  CriticalityColor
>(criticalities.map((v) => [v.level, v.color]));
