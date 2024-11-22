export const risks = [
  {
    name: 'high',
    level: 1,
    color: '#A80003',
    category: $localize`Critical`,
  },
  {
    name: 'medium',
    level: 2,
    color: '#ED0007',
    category: $localize`Major`,
  },
  {
    name: 'low',
    level: 3,
    color: '#FFCF00',
    category: $localize`Minor`,
  },
  {
    name: 'no',
    level: 4,
    color: '#00884A',
    category: $localize`No Risk`,
  },
] as const;

export const NO_RISK_DEFINED_COLOR = '#7D7476' as const;

export type RiskArray = typeof risks;
export type RiskLevel = RiskArray[number]['level'];
export type RiskColor =
  | RiskArray[number]['color']
  | typeof NO_RISK_DEFINED_COLOR;

export type Risk = RiskArray[number];

export const Risks = new Map<RiskLevel, Risk>(risks.map((v) => [v.level, v]));

export const RiskColors = new Map<number, RiskColor>(
  risks.map((v) => [v.level, v.color])
);
