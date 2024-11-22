
export const anomalies = [
  {
    name: 'no_anomaly',
    level: 0,
    color: '#00884a',
  },
  {
    name: 'has_anomaly',
    level: 1,
    color: '#ffcf00',
  },
  {
    name: 'critical_anomaly',
    level: 2,
    color: '#a80003',
  },
] as const;

export const UNKNOWN_DEFINED_COLOR = '#7d7476' as const;

export type AnomalyArray = typeof anomalies;
export type AnomalLevel = AnomalyArray[number]['level'];
export type AnomalyColor =
  | AnomalyArray[number]['color']
  | typeof UNKNOWN_DEFINED_COLOR;

export type Anomaly = AnomalyArray[number];

export const Anomalies = new Map<AnomalLevel, Anomaly>(
  anomalies.map((v) => [v.level, v])
);

export const AnomalyColors = new Map<number | null, AnomalyColor>(
  anomalies.map((v) => [v.level, v.color])
);
